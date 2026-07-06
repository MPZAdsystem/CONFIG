if (typeof window.toggleHallEnvironment === 'undefined') window.toggleHallEnvironment = function() {};
function runFlavorLoading(callback) {
    const overlay = document.getElementById('loadingOverlay');
    const bar = document.getElementById('flavorProgressBar');
    const textEl = document.getElementById('flavorText');

    overlay.style.display = 'flex';
    bar.style.transition = 'none'; bar.style.width = '0%'; // Reset paska

    // Losowanie 3 unikalnych tekstów
    let shuffled = [...flavorTexts].sort(() => 0.5 - Math.random());

    textEl.innerText = shuffled[0];
    void bar.offsetWidth; // Wymuszenie odświeżenia przeglądarki

    // Start animacji na równe 6 sekund
    bar.style.transition = 'width 6s linear';
    bar.style.width = '100%';

    // Zmiany tekstu co 2 sekundy
    setTimeout(() => { textEl.innerText = shuffled[1]; }, 2000);
    setTimeout(() => { textEl.innerText = shuffled[2]; }, 4000);

    // Koniec po 6 sekundach
    setTimeout(() => {
        overlay.style.display = 'none';
        if (callback) callback();
    }, 6000);
}

function handleLoginKey(e) {
    if (e.key === 'Enter') attemptLogin();
}

function attemptLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const err = document.getElementById('loginError');
    const remember = document.getElementById('rememberMe').checked;
    const loginBtn = document.querySelector('#loginOverlay button[onclick="attemptLogin()"]');

    if (!user || !pass) {
        err.style.display = 'block';
        err.innerText = 'Wprowadź login i hasło!';
        return;
    }

    // Blokada przycisku na czas zapytania
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerText = '⏳ Logowanie...';
    }
    err.style.display = 'none';

    // AJAX POST do api_login.php (serwer PHP weryfikuje przez API CMS)
    fetch('Api/api_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'cms_login=' + encodeURIComponent(user) + '&cms_password=' + encodeURIComponent(pass)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('PHP login endpoint not available or returned error');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'OK') {
            // Ustawiamy rolę na podstawie loginu: mpz, test i admin to admini, reszta to zwykli userzy
            const lowercaseUser = (data.user || user).toLowerCase();
            if (lowercaseUser === 'mpz' || lowercaseUser === 'test' || lowercaseUser === 'admin') {
                currentUserRole = 'admin';
            } else {
                currentUserRole = 'user';
            }

            if (remember) {
                try {
                    localStorage.setItem('expoBuilderRole', currentUserRole);
                    localStorage.setItem('expoBuilderUser', data.user || user);
                } catch (e) {
                    console.warn("Storage item write blocked:", e);
                }
            }

            document.getElementById('loginOverlay').style.display = 'none';
            runFlavorLoading(() => { applyRolePermissions(); });
        } else {
            // Logowanie nieudane
            console.warn("Błąd logowania (szczegóły diagnostyczne):", data);
            err.style.display = 'block';
            err.innerText = data.message || 'Nieprawidłowy login lub hasło!';
        }
    })
    .catch(error => {
        console.error("Błąd połączenia z API logowania (próba fallback offline):", error);
        
        // Fallback dla GitHub Pages lub braku PHP
        const lowercaseUser = user.toLowerCase();
        if ((lowercaseUser === 'test' && pass === 'adsys222') || (lowercaseUser === 'admin' && pass === 'admin123')) {
            currentUserRole = 'admin';
            if (remember) {
                try {
                    localStorage.setItem('expoBuilderRole', currentUserRole);
                    localStorage.setItem('expoBuilderUser', user);
                } catch (e) {
                    console.warn("Storage item write blocked:", e);
                }
            }
            document.getElementById('loginOverlay').style.display = 'none';
            runFlavorLoading(() => { applyRolePermissions(); });
        } else {
            err.style.display = 'block';
            err.innerText = 'Nieprawidłowy login lub hasło! (Tryb offline)';
        }
    })
    .finally(() => {
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerText = 'Zaloguj się';
        }
    });
}

function checkSavedLogin() {
    // Sprawdzamy sesję PHP na serwerze (zamiast localStorage)
    fetch('Api/api_check_session.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('PHP check session endpoint not available');
            }
            return response.json();
        })
        .then(data => {
            if (data.logged_in === true) {
                // Sesja PHP aktywna — wpuszczamy użytkownika z odpowiednią rolą
                const checkUser = (data.user || '').toLowerCase();
                if (checkUser === 'mpz' || checkUser === 'test' || checkUser === 'admin') {
                    currentUserRole = 'admin';
                } else {
                    currentUserRole = 'user';
                }
                document.getElementById('loginOverlay').style.display = 'none';
                runFlavorLoading(() => { applyRolePermissions(); });
            } else {
                // Brak sesji PHP — nie logujemy automatycznie, wymagamy wpisania danych
                // Pokazujemy formularz logowania (który domyślnie jest już widoczny)
            }
        })
        .catch(error => {
            // Brak dostępu do serwera (offline/lokalny dev) — fallback na localStorage
            console.warn("Nie można sprawdzić sesji serwerowej, fallback na localStorage:", error);
            let savedRole = null;
            let savedUser = null;
            try {
                savedRole = localStorage.getItem('expoBuilderRole');
                savedUser = localStorage.getItem('expoBuilderUser');
            } catch (e) {
                console.warn("Storage read blocked:", e);
            }
            if (savedRole && savedUser) {
                const lowercaseUser = savedUser.toLowerCase();
                if (lowercaseUser === 'mpz' || lowercaseUser === 'test' || lowercaseUser === 'admin') {
                    currentUserRole = 'admin';
                } else {
                    currentUserRole = 'user';
                }
                document.getElementById('loginOverlay').style.display = 'none';
                runFlavorLoading(() => { applyRolePermissions(); });
            }
        });
}

function logout() {
    // Wylogowanie z serwera PHP
    fetch('Api/api_logout.php')
        .then(() => {
            console.log("Sesja serwerowa zakończona.");
        })
        .catch(err => {
            console.warn("Błąd wylogowania z serwera:", err);
        });

    // Czyścimy localStorage
    try {
        localStorage.removeItem('expoBuilderRole');
        localStorage.removeItem('expoBuilderUser');
    } catch (e) {
        console.warn("Storage remove blocked:", e);
    }
    currentUserRole = null;

    // Czyścimy pola formularza
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('rememberMe').checked = false;
    document.getElementById('loginError').style.display = 'none';

    // Pokazujemy ekran logowania ponownie
    document.getElementById('loginOverlay').style.display = 'flex';
}


function applyRolePermissions() {
    const adminBtn = document.getElementById('btnAdminDB');
    const discountRow = document.getElementById('discountInput') ? document.getElementById('discountInput').parentElement : null;
    const sheetsBtn = document.getElementById('btnExportSheets');

    // Bezpieczny reset do stanu domyślnego
    if (adminBtn) adminBtn.style.display = 'none';
    if (discountRow) discountRow.style.display = 'flex';
    if (sheetsBtn) sheetsBtn.style.display = 'flex';

    // Narzucenie ograniczeń dla ról
    if (currentUserRole === 'admin') {
        if (adminBtn) adminBtn.style.display = 'flex';
    } else if (currentUserRole === 'klient') {
        if (discountRow) discountRow.style.display = 'none';
        if (sheetsBtn) sheetsBtn.style.display = 'none';
    }
}

function openDbEditor() {
    const content = document.getElementById('dbEditorContent');
    content.innerHTML = '';

    // Przelatujemy przez baza DB i budujemy dla każdego elementu wiersz z ceną
    for (const key in DB) {
        const item = DB[key];
        if (item.price !== undefined) {
            content.innerHTML += `
                        <div class="db-row">
                            <span><b>${item.name}</b> <br><i style="color:#888;">${item.catNo || 'Brak SKU'}</i></span>
                            <div>
                                <input type="number" id="db_price_${key}" value="${item.price}" step="1"> €
                            </div>
                        </div>
                    `;
        }
    }
    document.getElementById('dbEditorOverlay').style.display = 'flex';
}

function closeDbEditor() {
    document.getElementById('dbEditorOverlay').style.display = 'none';
}

function saveDbEdits() {
    // Zapisujemy nowe ceny z powrotem do głównego obiektu DB
    for (const key in DB) {
        if (DB[key].price !== undefined) {
            const inp = document.getElementById(`db_price_${key}`);
            if (inp) {
                DB[key].price = parseFloat(inp.value) || 0;
            }
        }
    }
    closeDbEditor();
    render(); // Aktualizuje koszty w aktywnym projekcie na żywo!
    alert("Baza cen (DB) została zaktualizowana!");
}

window.manualCartDraft = {};

function removePolishAccents(str) {
    const map = { 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z', 'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z' };
    return str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, match => map[match]);
}

function scoreResult(name, intranetId, queryWords) {
    let nameNorm = removePolishAccents(name.toLowerCase());
    let idNorm = String(intranetId || '').toLowerCase();

    let matchedAll = true;
    let score = 0;

    for (let word of queryWords) {
        let indexInName = nameNorm.indexOf(word);
        let indexInId = idNorm.indexOf(word);

        if (indexInName !== -1) {
            if (indexInName === 0 || nameNorm.charAt(indexInName - 1) === ' ') {
                score += 15;
            } else {
                score += 5;
            }
            score -= (indexInName * 0.05);
        } else if (indexInId !== -1) {
            score += 20;
        } else {
            matchedAll = false;
            break;
        }
    }

    if (!matchedAll) return -1;
    score -= (name.length * 0.01);
    return score;
}

window.changeDraftQty = function (key, delta, itemData) {
    if (!window.manualCartDraft[key]) {
        if (delta <= 0) return;
        window.manualCartDraft[key] = {
            qty: 0,
            name: itemData.name,
            plnMargin: itemData.plnMargin,
            intranetId: itemData.intranetId,
            isKaseton: itemData.isKaseton
        };
    }

    window.manualCartDraft[key].qty += delta;
    if (window.manualCartDraft[key].qty <= 0) {
        delete window.manualCartDraft[key];
    }
    refreshManualPanel();
};

window.setDraftQty = function (key, val, itemData) {
    let qty = parseInt(val) || 0;
    if (qty <= 0) {
        delete window.manualCartDraft[key];
    } else {
        if (!window.manualCartDraft[key]) {
            window.manualCartDraft[key] = {
                qty: 0,
                name: itemData.name,
                plnMargin: itemData.plnMargin,
                intranetId: itemData.intranetId,
                isKaseton: itemData.isKaseton
            };
        }
        window.manualCartDraft[key].qty = qty;
    }
    refreshManualPanel();
};

window.removeFromDraft = function (key) {
    delete window.manualCartDraft[key];
    refreshManualPanel();
};

window.submitManualCart = function () {
    for (let k in manualItems) {
        delete manualItems[k];
    }

    const multInput = document.getElementById('manualMultiplierInput');
    const currentMultiplier = multInput ? parseFloat(multInput.value) : 2.8;

    for (let k in window.manualCartDraft) {
        let draftItem = window.manualCartDraft[k];
        if (draftItem.qty > 0) {
            manualItems[k] = {
                qty: draftItem.qty,
                name: draftItem.name,
                plnMargin: draftItem.plnMargin,
                intranetId: draftItem.intranetId,
                isManual: true,
                isKaseton: draftItem.isKaseton,
                multiplier: currentMultiplier
            };
        }
    }

    closeManualModal();
    if (typeof render === 'function') render();

    // Integracja z modalem Intranetu (BOM)
    if (window.openedFromIntranetModal) {
        window.openedFromIntranetModal = false;
        if (window.intranetBOMDraft) {
            const ratePLN = window.KURS_PLN_DYNAMIC || 4.20;

            // 1. Aktualizacja istniejących i dodawanie nowych pozycji manualnych
            for (let k in manualItems) {
                const item = manualItems[k];
                let foundIndex = window.intranetBOMDraft.findIndex(d => d.name === item.name && d.isManual);

                if (foundIndex !== -1) {
                    window.intranetBOMDraft[foundIndex].qty = item.qty;
                } else {
                    const isKasetonItem = item.isKaseton;
                    const priceEUR = isKasetonItem ? null : ((item.plnMargin * currentMultiplier) / ratePLN);

                    window.intranetBOMDraft.push({
                        id: isKasetonItem ? null : (item.intranetId || null),
                        parentId: isKasetonItem ? (item.intranetId || null) : null,
                        name: item.name,
                        qty: item.qty,
                        price: priceEUR,
                        vat: isKasetonItem ? '0%' : '23%',
                        displayName: '',
                        description: '',
                        isParent: false,
                        isManual: true,
                        isKaseton: isKasetonItem
                    });
                }
            }

            // 2. Usuwanie z draftu tych wierszy manualnych, które zostały usunięte z koszyka
            window.intranetBOMDraft = window.intranetBOMDraft.filter(d => {
                if (!d.isManual) return true;
                let exists = false;
                for (let k in manualItems) {
                    if (manualItems[k].name === d.name) {
                        exists = true;
                        break;
                    }
                }
                return exists;
            });

            // Re-render tabeli
            if (typeof window.renderIntranetBomTable === 'function') {
                window.renderIntranetBomTable();
            }
        }
    }
};

window.clearManualCart = function () {
    window.manualCartDraft = {};
    refreshManualPanel();
};

function calculateWydrukArea(name) {
    if (!name || typeof name !== 'string') return null;
    if (!/wydruk/i.test(name)) return null;
    const normalized = name.replace(/,/g, '.');
    const match = normalized.match(/(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)/);
    if (!match) return null;
    const val1 = parseFloat(match[1]);
    const val2 = parseFloat(match[2]);
    if (isNaN(val1) || isNaN(val2)) return null;
    if (val1 <= 15 && val2 <= 15) {
        return val1 * val2;
    } else {
        return (val1 / 100) * (val2 / 100);
    }
}

function refreshManualPanel() {
    const tableBody = document.getElementById('manualAddAvailableTable');
    const selectedContainer = document.getElementById('manualAddSelected');
    if (!tableBody || !selectedContainer) return;

    const searchInput = document.getElementById('manualSearchInput');
    const multInput = document.getElementById('manualMultiplierInput');

    const query = searchInput ? searchInput.value.trim() : '';
    const multiplier = multInput ? parseFloat(multInput.value) || 2.8 : 2.8;
    const ratePLN = window.KURS_PLN_DYNAMIC || 4.20;

    const allProducts = {};

    if (typeof DB !== 'undefined') {
        for (let key in DB) {
            let dbItem = DB[key];
            if (dbItem.price !== undefined && dbItem.price > 0) {
                let eurPrice = dbItem.price;
                let plnPrice = eurPrice * ratePLN;
                let plnMargin = plnPrice / 2.8;
                allProducts[dbItem.name] = {
                    key: key,
                    name: dbItem.name,
                    intranetId: dbItem.catNo || '',
                    plnMargin: plnMargin,
                    category: dbItem.type || '',
                    isKaseton: false,
                    noPrice: false
                };
            }
        }
    }

    if (window.KASETON_PRICES) {
        for (let name in window.KASETON_PRICES) {
            let kItem = window.KASETON_PRICES[name];
            allProducts[name] = {
                key: name,
                name: name,
                intranetId: kItem.intranetId || '',
                plnMargin: kItem.plnMargin || 0,
                category: kItem.category || '',
                isKaseton: true,
                noPrice: kItem.noPrice || false
            };
        }
    }

    let results = [];
    if (query.length > 0) {
        let queryWords = removePolishAccents(query.toLowerCase()).split(/\s+/).filter(w => w.length > 0);
        for (let name in allProducts) {
            let p = allProducts[name];
            let score = scoreResult(p.name, p.intranetId, queryWords);
            if (score >= 0) {
                results.push({ product: p, score: score });
            }
        }
        results.sort((a, b) => b.score - a.score);
    } else {
        for (let name in allProducts) {
            results.push({ product: allProducts[name], score: 0 });
        }
        results.sort((a, b) => a.product.name.localeCompare(b.product.name));
    }

    results = results.slice(0, 50);

    let tableHtml = '';
    if (results.length === 0) {
        tableHtml = `<tr><td colspan="5" style="text-align:center; padding: 20px; color:#8f95b2;">Brak wyników wyszukiwania...</td></tr>`;
    } else {
        results.forEach(res => {
            let p = res.product;
            let draftItem = window.manualCartDraft[p.key];
            let qty = draftItem ? draftItem.qty : 0;

            // Check if it's a print and extract area
            let isWydrukWithArea = false;
            let wydrukArea = 0;
            const area = calculateWydrukArea(p.name);
            if (area !== null) {
                isWydrukWithArea = true;
                wydrukArea = area;
            }

            let hasNoPrice = p.noPrice;
            if (hasNoPrice && isWydrukWithArea) {
                hasNoPrice = false;
            }

            let plnMargin = p.plnMargin;
            let clientPrice = plnMargin * multiplier;

            if (isWydrukWithArea) {
                clientPrice = wydrukArea * 100; // 100 PLN per m2
                plnMargin = clientPrice / multiplier;
            }

            // Check override
            if (window.customPriceOverrides && window.customPriceOverrides[p.name] !== undefined) {
                clientPrice = window.customPriceOverrides[p.name] * ratePLN;
                plnMargin = clientPrice / multiplier;
                hasNoPrice = false;
            }

            if (plnMargin > 0 || clientPrice > 0) {
                hasNoPrice = false;
            }

            let actionHtml = '';
            let itemDataJson = JSON.stringify({
                name: p.name,
                plnMargin: plnMargin,
                intranetId: p.intranetId,
                isKaseton: p.isKaseton
            }).replace(/"/g, '&quot;');

            if (qty === 0) {
                actionHtml = `<button class="btn-row-add" onclick="changeDraftQty('${p.key}', 1, ${itemDataJson})">➕ Dodaj</button>`;
            } else {
                actionHtml = `
                    <div class="qty-control" style="justify-content: center;">
                        <button class="btn-qty btn-minus" onclick="changeDraftQty('${p.key}', -1, ${itemDataJson})">-</button>
                        <input class="qty-input" type="number" value="${qty}" onchange="setDraftQty('${p.key}', this.value, ${itemDataJson})">
                        <button class="btn-qty btn-plus" onclick="changeDraftQty('${p.key}', 1, ${itemDataJson})">+</button>
                    </div>
                `;
            }

            let categoryLabelHtml = p.category ? `<br><span style="font-size:10px; color:#8f95b2; font-style:italic;">${p.category}</span>` : '';

            let priceLabelHtml = '';
            let marginLabelHtml = '';
            let rowStyle = '';

            if (hasNoPrice) {
                rowStyle = 'background: rgba(255, 0, 0, 0.07);';
                marginLabelHtml = `<span style="color:#ff3333; font-weight:bold;">Brak</span>`;
                priceLabelHtml = `<span style="color:#ff3333; font-weight:bold;">Brak ceny w DB!</span>`;
            } else {
                marginLabelHtml = `${plnMargin.toFixed(2).toString().replace('.', ',')} zł`;
                priceLabelHtml = `${clientPrice.toFixed(2).toString().replace('.', ',')} zł`;
            }

            let skuDisplay = p.intranetId;
            if (!skuDisplay) {
                skuDisplay = '<span style="color:#ff3333; font-weight:bold;">Brak ERP-ERR</span>';
            }

            tableHtml += `
                <tr style="${rowStyle}">
                    <td style="font-weight:600; color:#fff; text-align: left; vertical-align: middle;">
                        <span>${p.name}</span>${categoryLabelHtml}
                    </td>
                    <td style="color:#a0a5c1; text-align: left;">${skuDisplay}</td>
                    <td style="color:#00b894; font-weight:600; text-align: left;">${marginLabelHtml}</td>
                    <td style="color:#2a75d3; font-weight:bold; text-align: left;">${priceLabelHtml}</td>
                    <td style="text-align: center;">${actionHtml}</td>
                </tr>
            `;
        });
    }
    tableBody.innerHTML = tableHtml;

    let cartHtml = '';
    let totalMarginSum = 0;
    let totalClientPriceSum = 0;
    let totalQty = 0;
    let hasMissingPriceInCart = false;
    let totalPrintArea = 0;

    let draftKeys = Object.keys(window.manualCartDraft);
    if (draftKeys.length === 0) {
        cartHtml = `
            <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; color:#555; font-size:13px; text-align:center; padding: 20px;">
                <span style="font-size:32px; margin-bottom:10px;">🛒</span>
                Twój koszyk roboczy jest pusty.<br>Dodaj produkty z bazy po lewej stronie.
            </div>
        `;
    } else {
        draftKeys.forEach(key => {
            let item = window.manualCartDraft[key];

            // Check if it's a print and extract area
            let isWydrukWithArea = false;
            let wydrukArea = 0;
            const area = calculateWydrukArea(item.name);
            if (area !== null) {
                isWydrukWithArea = true;
                wydrukArea = area;
                totalPrintArea += area * item.qty;
            }

            // Determine if it has no price in database
            let itemHasNoPrice = false;
            if (window.KASETON_PRICES && window.KASETON_PRICES[item.name] && window.KASETON_PRICES[item.name].noPrice) {
                if (!isWydrukWithArea) {
                    itemHasNoPrice = true;
                }
            }

            let plnMargin = item.plnMargin;
            let lineClientPrice = plnMargin * multiplier * item.qty;

            if (isWydrukWithArea) {
                lineClientPrice = (wydrukArea * 100) * item.qty;
                plnMargin = (wydrukArea * 100) / multiplier;
            }

            if (window.customPriceOverrides && window.customPriceOverrides[item.name] !== undefined) {
                lineClientPrice = (window.customPriceOverrides[item.name] * ratePLN) * item.qty;
                plnMargin = (window.customPriceOverrides[item.name] * ratePLN) / multiplier;
                itemHasNoPrice = false;
            }

            if (plnMargin > 0 || lineClientPrice > 0) {
                itemHasNoPrice = false;
            }

            let lineMargin = plnMargin * item.qty;

            if (itemHasNoPrice) {
                hasMissingPriceInCart = true;
            } else {
                totalMarginSum += lineMargin;
                totalClientPriceSum += lineClientPrice;
            }
            totalQty += item.qty;

            let itemDataJson = JSON.stringify({
                name: item.name,
                plnMargin: plnMargin,
                intranetId: item.intranetId,
                isKaseton: item.isKaseton
            }).replace(/"/g, '&quot;');

            let cartRowStyle = '';
            let cartPriceHtml = '';
            if (itemHasNoPrice) {
                cartRowStyle = 'background: rgba(255, 0, 0, 0.15); border: 1px solid #ff3333; border-radius: 4px; padding: 4px; margin-bottom: 5px;';
                cartPriceHtml = `
                    <div style="text-align: right;">
                        <span style="color:#ff3333; font-weight:bold; font-size:11px;">Brak ceny!</span>
                    </div>
                `;
            } else {
                cartPriceHtml = `
                    <div style="text-align: right;">
                        <span style="color:#00b894; font-weight:600;">${lineMargin.toFixed(2).toString().replace('.', ',')} zł</span> <br>
                        <span style="color:#2a75d3; font-weight:bold; font-size:12px;">${lineClientPrice.toFixed(2).toString().replace('.', ',')} zł</span>
                    </div>
                `;
            }

            cartHtml += `
                <div class="cart-item-row" style="${cartRowStyle}">
                    <div class="cart-item-main">
                        <span class="cart-item-name" style="text-align: left;">${item.name} ${itemHasNoPrice ? '<span style="color:#ff3333; font-size:10px;">[!]</span>' : ''}</span>
                        <button class="cart-item-remove" onclick="removeFromDraft('${key}')" title="Usuń z koszyka">🗑️</button>
                    </div>
                    <div class="cart-item-qty-price">
                        <div class="qty-control">
                            <button class="btn-qty btn-minus" style="width:20px; height:20px; font-size:11px;" onclick="changeDraftQty('${key}', -1, ${itemDataJson})">-</button>
                            <input class="qty-input" style="width:28px; padding:1px 0; font-size:11px;" type="number" value="${item.qty}" onchange="setDraftQty('${key}', this.value, ${itemDataJson})">
                            <button class="btn-qty btn-plus" style="width:20px; height:20px; font-size:11px;" onclick="changeDraftQty('${key}', 1, ${itemDataJson})">+</button>
                        </div>
                        ${cartPriceHtml}
                    </div>
                </div>
            `;
        });
    }

    selectedContainer.innerHTML = cartHtml;

    const badge = document.getElementById('cartCountBadge');
    if (badge) badge.innerText = `${totalQty} szt`;

    const marginSpan = document.getElementById('summaryMarginTotal');
    if (marginSpan) {
        marginSpan.innerText = `${totalMarginSum.toFixed(2).toString().replace('.', ',')} PLN`;
        if (hasMissingPriceInCart) {
            marginSpan.innerHTML += ` <span style="color:#ff3333; font-size:10px;">(+brak)</span>`;
        }
    }

    const priceSpan = document.getElementById('summaryPriceTotal');
    if (priceSpan) {
        priceSpan.innerText = `${totalClientPriceSum.toFixed(2).toString().replace('.', ',')} PLN`;
        if (hasMissingPriceInCart) {
            priceSpan.innerHTML += ` <span style="color:#ff3333; font-size:10px;">(+brak)</span>`;
        }
    }

    let totalWeight = 0;
    if (window.currentKasetonConfig && typeof calculateKasetonWeight === 'function') {
        totalWeight = calculateKasetonWeight(window.currentKasetonConfig);
    }

    const ordpCountEl = document.getElementById('ordp_count');
    if (ordpCountEl) {
        ordpCountEl.value = totalClientPriceSum.toFixed(2).toString().replace('.', ',');
    }
    const stoChEl = document.getElementById('sto_ch');
    if (stoChEl) {
        let valToInject = totalWeight > 0 ? totalWeight : totalPrintArea;
        stoChEl.value = valToInject.toFixed(2).toString().replace('.', ',');
    }
}

function updateDimensionsButtonUI() {
    const btn = document.getElementById('btnToggleDimensions');
    if (!btn) return;
    
    const isBlocked = typeof currentSystem !== 'undefined' && ['wydruki', 'mframe_pallet', 'prompt_generator'].includes(currentSystem);
    btn.style.display = isBlocked ? 'none' : 'flex';
    
    btn.classList.toggle('active', showDimensions);
    btn.style.background = '';
    btn.style.color = '';
    btn.style.border = '';
    btn.style.boxShadow = '';
    if (showDimensions) {
        btn.innerHTML = '📐 Wizualizacja techniczna (WŁ)';
    } else {
        btn.innerHTML = '📐 Wizualizacja techniczna';
    }
}
window.updateDimensionsButtonUI = updateDimensionsButtonUI;

function updateModuleListButtonUI() {
    const btn = document.getElementById('btnModuleList');
    if (!btn) return;
    
    const isBlocked = typeof currentSystem !== 'undefined' && ['wydruki', 'mframe_pallet', 'prompt_generator'].includes(currentSystem);
    btn.style.display = isBlocked ? 'none' : 'flex';
    
    btn.classList.remove('active', 'bw-mode');
    btn.style.background = '';
    btn.style.color = '';
    btn.style.border = '';
    btn.style.boxShadow = '';

    if (showModuleListMode === 'bw') {
        btn.classList.add('bw-mode');
        btn.innerHTML = '📋 Numerowanie modułów (B/W)';
    } else if (showModuleListMode) {
        btn.classList.add('active');
        btn.innerHTML = '📋 Numerowanie modułów (WŁ)';
    } else {
        btn.innerHTML = '📋 Numerowanie modułów';
    }
}
window.updateModuleListButtonUI = updateModuleListButtonUI;

window.getGrossDimensionText = function(wCm, hCm, isSego, isBacklit) {
    if (isSego) {
        const wMm = Math.round(wCm * 10) + 7;
        const hMm = Math.round(hCm * 10) + 7;
        return `${wMm}x${hMm} mm`;
    }

    let wMm, hMm;
    if (isBacklit) {
        const getBacklitAdd = (val) => {
            if (val <= 50) return 18;
            if (val <= 80) return 16;
            if (val <= 100) return 15;
            if (val <= 150) return 14;
            if (val <= 200) return 13;
            if (val <= 250) return 12;
            if (val <= 300) return 12;
            return 10;
        };
        wMm = Math.round(wCm * 10) + getBacklitAdd(wCm);
        hMm = Math.round(hCm * 10) + getBacklitAdd(hCm);
    } else {
        const getBlockoutWidthAdd = (val) => {
            if (val <= 50) return 14;
            if (val <= 111.6) return 15;
            if (val <= 160) return 14;
            if (val <= 200) return 11;
            if (val <= 248) return 5;
            if (val <= 300) return 10;
            if (val <= 400) return 10;
            if (val <= 500) return 10;
            if (val <= 600) return 10;
            if (val <= 700) return 10;
            return 10;
        };
        const getBlockoutHeightAdd = (val) => {
            if (val <= 99.2) return 15;
            if (val <= 148.8) return 14;
            if (val <= 198.4) return 11;
            if (val <= 248) return 5;
            if (val <= 300) return 10;
            if (val <= 400) return 10;
            if (val <= 500) return 10;
            if (val <= 600) return 10;
            if (val <= 700) return 10;
            return 10;
        };
        wMm = Math.round(wCm * 10) + getBlockoutWidthAdd(wCm);
        hMm = Math.round(hCm * 10) + getBlockoutHeightAdd(hCm);
    }
    return `${wMm}x${hMm} mm`;
};

function buildModuleListTable() {
    const overlay = document.getElementById('moduleListSidebarOverlay');
    if (!overlay) return;

    if (!window.assignedModulesList || window.assignedModulesList.length === 0) {
        overlay.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 2px solid #ff0080; padding-bottom: 10px;">
                <h3 style="margin:0; color:#fff; font-size: 16px;">📋 Lista Modułów</h3>
                <button onclick="toggleModuleListMode()" style="background:#cc005f; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:bold;">Zamknij</button>
            </div>
            <p style="color:#888; font-size:12px;">Brak modułów do wyświetlenia. Upewnij się, że jesteś w trybie 3D.</p>
        `;
        return;
    }

    const isBW = typeof showModuleListMode !== 'undefined' && showModuleListMode === 'bw';
    const mainAccentColor = isBW ? '#888888' : '#ff0080';
    const subAccentColor = isBW ? '#888888' : '#00d2ff';
    const titleBorderColor = isBW ? '#555555' : '#ff0080';

    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 2px solid ${titleBorderColor}; padding-bottom: 10px;">
            <h3 style="margin:0; color:#fff; font-size: 16px;">📋 Lista Modułów</h3>
            <button onclick="toggleModuleListMode()" style="background:#cc005f; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:bold;">Zamknij</button>
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:11px; color:#fff;">
            <thead>
                <tr style="border-bottom:1px solid #444; color:#aaa; text-align:left;">
                    <th style="padding:6px 4px; font-weight:bold;">Indeks / Nazwa</th>
                    <th style="padding:6px 4px; font-weight:bold; text-align:right; color:${subAccentColor};">Wytyczne do wydruku</th>
                </tr>
            </thead>
            <tbody>
    `;

    window.assignedModulesList.forEach((mod) => {
        const item = mod.item;
        const part = mod.part;
        
        let letter = '';
        let name = '';
        let widthCm = 0;
        let heightCm = 0;
        let isSego = false;
        
        if (typeof currentSystem !== 'undefined' && (currentSystem === 'SEGO' || currentSystem === 'SEGO_2_0')) {
            isSego = true;
        }

        if (part === 'wall') {
            letter = window.wallLetters ? window.wallLetters.get(item) : '';
            if (item.isLCD) {
                name = `[Ściana ${letter}] ${item.labelEN || 'Wall'}`;
            } else {
                name = item.isStacked ? `[Nadstawka ${letter}] ${item.labelEN || 'Wall'}` : `[Moduł ${letter}] ${item.labelEN || 'Wall'}`;
            }
            widthCm = item.length;
            heightCm = item.height;
        } else if (part === 'roof') {
            letter = window.wallLetters ? window.wallLetters.get(item.planIndex + '_roof') : '';
            name = `[Moduł ${letter}] Daszek (Dach)`;
            widthCm = 100;
            heightCm = 250;
        } else if (part === 'leg') {
            letter = window.wallLetters ? window.wallLetters.get(item.planIndex + '_leg') : '';
            name = `[Moduł ${letter}] Daszek (Noga)`;
            widthCm = 100;
            heightCm = item.wallHeight || 250;
        }

        const sizeCmText = `${widthCm}x${heightCm} cm`;

        html += `
            <tr style="background: rgba(255, 255, 255, 0.05); border-bottom: 1px solid #333; font-weight: bold; color: ${mainAccentColor};">
                <td style="padding:8px 4px;">${name}</td>
                <td style="padding:8px 4px; text-align:right; font-family: monospace;">${sizeCmText}</td>
            </tr>
        `;

        const sides = [];
        if (part === 'wall') {
            if (item.isLCD) {
                sides.push({
                    label: 'Zewnętrzny',
                    index: 1,
                    fileName: item.textureFrontName,
                    widthCm: widthCm,
                    heightCm: heightCm
                });
                sides.push({
                    label: 'Wewnętrzny',
                    index: 2,
                    fileName: item.textureBackName,
                    widthCm: widthCm - 28,
                    heightCm: heightCm
                });
            } else {
                sides.push({
                    label: 'Przód',
                    index: 1,
                    fileName: item.textureFrontName,
                    widthCm: widthCm,
                    heightCm: heightCm
                });
                sides.push({
                    label: 'Tył',
                    index: 2,
                    fileName: item.textureBackName,
                    widthCm: widthCm,
                    heightCm: heightCm
                });
            }
        } else if (part === 'roof') {
            const accData = item.accData || {};
            sides.push({
                label: 'Góra',
                index: 1,
                fileName: accData.texRoofFrontName || (accData.texRoofFront ? 'Grafika wgrana' : null),
                widthCm: widthCm,
                heightCm: heightCm
            });
            sides.push({
                label: 'Dół',
                index: 2,
                fileName: accData.texRoofBackName || (accData.texRoofBack ? 'Grafika wgrana' : null),
                widthCm: widthCm,
                heightCm: heightCm
            });
        } else if (part === 'leg') {
            const accData = item.accData || {};
            sides.push({
                label: 'Przód',
                index: 1,
                fileName: accData.texLegFrontName || (accData.texLegFront ? 'Grafika wgrana' : null),
                widthCm: widthCm,
                heightCm: heightCm
            });
            sides.push({
                label: 'Tył',
                index: 2,
                fileName: accData.texLegBackName || (accData.texLegBack ? 'Grafika wgrana' : null),
                widthCm: widthCm,
                heightCm: heightCm
            });
        }

        sides.forEach((side) => {
            const graphicName = side.fileName || 'Brak grafiki';
            const hasGraphic = !!side.fileName;
            const netText = `${side.widthCm}x${side.heightCm} cm`;

            // Determine if this side is backlit (podświetlony) or blockout
            let isBacklit = false;
            if (item.isLCD) {
                // LCD_LMD: check print option from config
                const cfg = window.currentKasetonConfig || {};
                const printOpt = cfg.print || 'double_divided';
                const isDoublePrint = ['double_divided', 'double_wrapping'].includes(printOpt);
                if (side.index === 1) {
                    // Outer print — always backlit for LCD_LMD
                    isBacklit = true;
                } else {
                    // Inner print — backlit only if double, otherwise blockout
                    isBacklit = isDoublePrint;
                }
            } else if (typeof currentSystem !== 'undefined' && currentSystem === 'kasetony_niestandardowe') {
                const cfg = window.currentKasetonConfig || {};
                const sys = cfg.system || 'LMD';
                const printOpt = cfg.print || 'single';
                const isLedSys = ['LMD', 'LMS', 'LMSM', 'CTF_LED'].includes(sys);
                if (isLedSys) {
                    if (printOpt === 'double') {
                        isBacklit = true;
                    } else if (printOpt === 'single' || printOpt === 'backlit_white' || printOpt === 'backlit_blockout') {
                        isBacklit = side.index === 1;
                    } else if (printOpt === 'front_blockout') {
                        isBacklit = false;
                    } else {
                        isBacklit = side.index === 1;
                    }
                } else {
                    isBacklit = false;
                }
            }

            const grossText = window.getGrossDimensionText(side.widthCm, side.heightCm, isSego, isBacklit);

            html += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.02); color:#ccc;">
                    <td style="padding:6px 4px 6px 16px; font-style:italic;">
                        <span style="color:#888; margin-right:4px;">└─</span> 
                        <strong style="color:${mainAccentColor}; font-family:monospace; margin-right:4px;">${letter}${side.index}</strong> 
                        <span style="color:#aaa; font-size:10px; margin-right:4px;">(${side.label}):</span>
                        <span style="${hasGraphic ? (isBW ? '#aaa' : '#1dd1a1') : '#666'}; font-weight:${hasGraphic ? '500' : 'normal'};">${graphicName}</span> 
                        <span style="color:#999; font-size:10px;">(${netText})</span>
                    </td>
                    <td style="padding:6px 4px; text-align:right; font-family: monospace; color:${subAccentColor}; font-weight:bold;">
                        ${grossText}
                    </td>
                </tr>
            `;
        });
    });

    html += `
            </tbody>
        </table>
    `;

    overlay.innerHTML = html;
}
window.buildModuleListTable = buildModuleListTable;

function toggleModuleListMode() {
    if (!showModuleListMode) {
        showModuleListMode = true;
    } else if (showModuleListMode === true) {
        showModuleListMode = 'bw';
    } else {
        showModuleListMode = false;
    }
    
    const stage = document.getElementById('stage');
    if (stage) {
        if (showModuleListMode === 'bw') {
            stage.classList.add('stage-bw-mode');
        } else {
            stage.classList.remove('stage-bw-mode');
        }
    }
    
    // Toggle sidebar overlay
    const overlay = document.getElementById('moduleListSidebarOverlay');
    if (overlay) {
        overlay.style.display = showModuleListMode ? 'block' : 'none';
        if (showModuleListMode) {
            buildModuleListTable();
        }
    }
    
    updateModuleListButtonUI();
    if (is3DMode) {
        update3DScene();
    } else {
        render();
    }
}
window.toggleModuleListMode = toggleModuleListMode;

document.addEventListener('DOMContentLoaded', () => {
    updateDimensionsButtonUI();
    updateModuleListButtonUI();
    if (typeof window.updateBottomToolbarGroups === 'function') {
        window.updateBottomToolbarGroups();
    }
});

function toggleDimensions() {
    showDimensions = !showDimensions;
    isBlueprintMode = showDimensions; // Tryb techniczny włącza się razem z wymiarami
    if (is3DMode) update3DScene();
    // Populate/hide the legend panel (blueprintLegendItems set by drawKasetonScene)
    if (typeof window.refreshBlueprintLegend === 'function') window.refreshBlueprintLegend();
    
    updateDimensionsButtonUI();
}

function toggleSceneSettings() {
    const panel = document.getElementById('settingsPanel');
    if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function toggleGraphicsPanel() {
    const panel = document.getElementById('graphicsPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        if (panel.style.display === 'block') refreshGraphicsList();
    }
}

function refreshGraphicsList() {
    const container = document.getElementById('graphicsListContent');
    if (!container) return;
    let html = '';
    let hasFiles = false;

    if (floorConfig.textureName) {
        hasFiles = true;
        html += `<div class="graphics-item"><div class="graphics-item-title">Podłoga</div><div>Grafika: <span class="graphics-item-file">${floorConfig.textureName}</span></div></div>`;
    }

    if (currentSystem === 'kasetony_niestandardowe' && window.currentKasetonConfig) {
        const conf = window.currentKasetonConfig;
        const hasAnyKasetonFile = conf.textureFrontName || conf.textureBackName || conf.textureLeftName || conf.textureRightName ||
                                  conf.textureFrontInnerName || conf.textureBackInnerName || conf.textureLeftInnerName || conf.textureRightInnerName;
        if (hasAnyKasetonFile) {
            hasFiles = true;
            html += `<div class="graphics-item"><div class="graphics-item-title">Kaseton Niestandardowy (${conf.system})</div>`;
            if (conf.textureFrontName) html += `<div>Zewn. Przód: <span class="graphics-item-file">${conf.textureFrontName}</span></div>`;
            if (conf.textureBackName) html += `<div>Zewn. Tył: <span class="graphics-item-file">${conf.textureBackName}</span></div>`;
            if (conf.textureLeftName) html += `<div>Zewn. Lewy: <span class="graphics-item-file">${conf.textureLeftName}</span></div>`;
            if (conf.textureRightName) html += `<div>Zewn. Prawy: <span class="graphics-item-file">${conf.textureRightName}</span></div>`;
            if (conf.textureFrontInnerName) html += `<div>Wewn. Przód: <span class="graphics-item-file">${conf.textureFrontInnerName}</span></div>`;
            if (conf.textureBackInnerName) html += `<div>Wewn. Tył: <span class="graphics-item-file">${conf.textureBackInnerName}</span></div>`;
            if (conf.textureLeftInnerName) html += `<div>Wewn. Lewy: <span class="graphics-item-file">${conf.textureLeftInnerName}</span></div>`;
            if (conf.textureRightInnerName) html += `<div>Wewn. Prawy: <span class="graphics-item-file">${conf.textureRightInnerName}</span></div>`;
            html += `</div>`;
        }
    }

    plan.forEach((item, index) => {
        if ((item.type === 'wall' || item.type === 'freestanding' || item.type === 'freestanding_s') && (item.textureFrontName || item.textureBackName)) {
            hasFiles = true;
            let dispName = item.type === 'wall' ? (item.isStacked ? ('Nadstawka Moduł ' + (index + 1)) : ('Moduł ' + (index + 1))) : (item.type === 'freestanding_s' ? 'Vario S-80' : 'Trybunka');
            html += `<div class="graphics-item"><div class="graphics-item-title">${dispName}: ${item.name}</div>`;
            if (item.textureFrontName) html += `<div>Przód: <span class="graphics-item-file">${item.textureFrontName}</span></div>`;
            if (item.textureBackName) html += `<div>Tył: <span class="graphics-item-file">${item.textureBackName}</span></div>`;

            if (typeof guidelineLinks !== 'undefined' && guidelineLinks[item.name]) {
                html += `<a href="${guidelineLinks[item.name]}" target="_blank" class="btn-guidelines" style="margin-top:5px; padding:6px; font-size:11px; background:#00d2ff; color:#000;">📥 Pobierz wytyczne</a>`;
            }
            html += `</div>`;
        }
        else if ((item.type === 'suspended' || item.type === 'suspended_ring') && item.quadTextures) {
            let quadHasFiles = false;
            let dispName = item.type === 'suspended_ring' ? 'Ringfloat' : 'Quadfloat';
            let qHtml = `<div class="graphics-item"><div class="graphics-item-title">${dispName}: ${item.name}</div>`;
            let maxSegments = item.type === 'suspended_ring' ? 3 : 4;
            for (let i = 1; i <= maxSegments; i++) {
                if (item.quadTextures['Out' + i + 'Name']) { qHtml += `<div>Zewn. ${i}: <span class="graphics-item-file">${item.quadTextures['Out' + i + 'Name']}</span></div>`; quadHasFiles = true; }
                if (item.quadTextures['In' + i + 'Name']) { qHtml += `<div>Wewn. ${i}: <span class="graphics-item-file">${item.quadTextures['In' + i + 'Name']}</span></div>`; quadHasFiles = true; }
            }
            qHtml += `</div>`;
            if (quadHasFiles) { hasFiles = true; html += qHtml; }
        }
        else if (item.type === 'kantorek_1x1' && item.quadTextures) {
            let quadHasFiles = false;
            let qHtml = `<div class="graphics-item"><div class="graphics-item-title">Kantorek 1x1</div>`;
            for (let i = 1; i <= 4; i++) {
                if (item.quadTextures['Out' + i + 'Name']) { qHtml += `<div>Zewn. Ściana ${i}: <span class="graphics-item-file">${item.quadTextures['Out' + i + 'Name']}</span></div>`; quadHasFiles = true; }
                if (item.quadTextures['In' + i + 'Name']) { qHtml += `<div>Wewn. Ściana ${i}: <span class="graphics-item-file">${item.quadTextures['In' + i + 'Name']}</span></div>`; quadHasFiles = true; }
            }
            qHtml += `</div>`;
            if (quadHasFiles) { hasFiles = true; html += qHtml; }
        }
        if (item.accessories) {
            item.accessories.forEach(acc => {
                if (acc.id === 'daszek' || acc.id === 'daszek100x200') {
                    let dHasFiles = acc.texRoofFrontName || acc.texRoofBackName || acc.texLegFrontName || acc.texLegBackName;
                    if (dHasFiles) {
                        hasFiles = true;
                        let daszekTitle = acc.id === 'daszek100x200' ? `Daszek 100x200 na Moduł ${index + 1}` : `Daszek 100x250 na Moduł ${index + 1}`;
                        html += `<div class="graphics-item"><div class="graphics-item-title">${daszekTitle}</div>`;
                        if (acc.texRoofFrontName) html += `<div>Dach Góra: <span class="graphics-item-file">${acc.texRoofFrontName}</span></div>`;
                        if (acc.texRoofBackName) html += `<div>Dach Dół: <span class="graphics-item-file">${acc.texRoofBackName}</span></div>`;
                        if (acc.texLegFrontName) html += `<div>Noga Przód: <span class="graphics-item-file">${acc.texLegFrontName}</span></div>`;
                        if (acc.texLegBackName) html += `<div>Noga Tył: <span class="graphics-item-file">${acc.texLegBackName}</span></div>`;
                        html += `</div>`;
                    }
                }
            });
        }
    });
    container.innerHTML = hasFiles ? html : 'Brak przypisanych grafik w projekcie.';
}

function toggleAutoRotate() {
    if (!controls) return;
    controls.autoRotate = !controls.autoRotate;
    const btn = document.getElementById('btnAutoRotate');
    if (!btn) return;
    if (controls.autoRotate) { btn.classList.add('active'); btn.innerText = "🔄 Auto-Obrót: WŁ"; }
    else { btn.classList.remove('active'); btn.innerText = "🔄 Auto-Obrót: WYŁ"; }
}

function toggleHumanModel() {
    window.currentHumanType = window.currentHumanType === 'soldier' ? 'dennis' : 'soldier';
    const btn = document.getElementById('btnToggleHuman');
    if (btn) {
        btn.innerText = window.currentHumanType === 'soldier' ? '💂 Postać: Żołnierz' : '🧍 Postać: Dennis';
    }
    if (typeof loadWalkingMan === 'function') {
        loadWalkingMan();
    }
}

function openManualModal() {
    window.manualCartDraft = {};
    const ratePLN = window.KURS_PLN_DYNAMIC || 4.20;

    if (typeof manualItems !== 'undefined') {
        for (let key in manualItems) {
            let item = manualItems[key];
            if (item && typeof item === 'object') {
                window.manualCartDraft[key] = {
                    qty: item.qty,
                    name: item.name,
                    plnMargin: item.plnMargin,
                    intranetId: item.intranetId,
                    isKaseton: item.isKaseton
                };
            } else if (item && typeof item === 'number' && item > 0) {
                let dbItem = DB[key];
                let name = dbItem ? dbItem.name : key;
                let iid = dbItem ? (dbItem.intranetId || dbItem.catNo) : '';
                let eurPrice = dbItem ? dbItem.price : 0;
                let plnPrice = eurPrice * ratePLN;
                let plnMargin = plnPrice / 2.8;
                window.manualCartDraft[key] = {
                    qty: item,
                    name: name,
                    plnMargin: plnMargin,
                    intranetId: iid,
                    isKaseton: false
                };
            }
        }
    }

    const searchInput = document.getElementById('manualSearchInput');
    if (searchInput) searchInput.value = '';

    const multInput = document.getElementById('manualMultiplierInput');
    if (multInput) {
        let firstKey = Object.keys(window.manualCartDraft)[0];
        if (firstKey && manualItems[firstKey] && manualItems[firstKey].multiplier) {
            multInput.value = manualItems[firstKey].multiplier;
        } else {
            multInput.value = '2.8';
        }
    }

    const modal = document.getElementById('manualModalOverlay');
    if (modal) modal.style.display = 'flex';
    if (typeof refreshManualPanel === 'function') refreshManualPanel();
}

function closeManualModal() {
    const modal = document.getElementById('manualModalOverlay');
    if (modal) modal.style.display = 'none';
}

function toggle3D() {
    try {
        if (typeof THREE === 'undefined') {
            alert("KRYTYCZNY BŁĄD: Biblioteka Three.js nie mogła zostać załadowana z internetu. Sprawdź połączenie sieciowe lub adblocka.");
            return;
        }

        is3DMode = !is3DMode;
        const container = document.getElementById('stage3DContainer');

        const btnToggle2D3D = document.getElementById('btnToggle2D3D');
        if (btnToggle2D3D) {
            btnToggle2D3D.innerHTML = is3DMode ? '❌ Wróć do 2D' : '👁️ Podgląd 3D';
            btnToggle2D3D.classList.toggle('active', is3DMode);
            btnToggle2D3D.style.background = '';
            btnToggle2D3D.style.borderColor = '';
            btnToggle2D3D.style.color = '';
        }
        const btn3d = document.querySelector('.btn-3d');
        if (btn3d) {
            btn3d.innerHTML = is3DMode ? '❌ Wróć do 2D' : '👁️ Wygeneruj Podgląd 3D';
        }

        const btnRadial = document.getElementById('btnToggleRadial');
        if (btnRadial) {
            btnRadial.style.display = (is3DMode && currentSystem === 'foldable') ? 'flex' : 'none';
        }
        const btnRand = document.getElementById('btnRandomizeGraphics');
        if (btnRand) {
            btnRand.style.display = (is3DMode && !['wydruki', 'mframe_pallet'].includes(currentSystem)) ? 'flex' : 'none';
        }
        const btnMagnet = document.getElementById('btnMagnetPull');
        if (btnMagnet) {
            btnMagnet.style.display = is3DMode ? 'none' : 'flex';
        }
        const btnToggleDimensions = document.getElementById('btnToggleDimensions');
        if (btnToggleDimensions) {
            btnToggleDimensions.style.display = 'flex';
        }
        const btnModuleList = document.getElementById('btnModuleList');
        if (btnModuleList) {
            btnModuleList.style.display = 'flex';
        }
        const btnCorners = document.getElementById('btnAutoResolveCorners');
        if (btnCorners) {
            btnCorners.style.display = is3DMode ? 'none' : 'flex';
        }
        if (typeof window.updateBottomToolbarGroups === 'function') {
            window.updateBottomToolbarGroups();
        }

        if (is3DMode) {
            if (container) container.style.display = 'block';

            setTimeout(() => {
                try {
                    if (!scene) {
                        init3D();
                    }
                    if (!isAnimating) {
                        animate3D();
                    }
                    update3DScene();
                } catch (innerError) {
                    alert("Błąd podczas inicjalizacji sceny 3D: " + innerError.message);
                    console.error("Szczegóły błędu wewnątrz pętli renderera:", innerError);
                }
            }, 50);

        } else {
            if (container) container.style.display = 'none';
            isAnimating = false;
            // Reset blueprint state when leaving 3D
            showDimensions = false;
            isBlueprintMode = false;
            window.blueprintLegendItems = null;
            window.blueprintDimensions = null;
            const blPanel = document.getElementById('blueprintLegend');
            if (blPanel) blPanel.style.display = 'none';
            
            // Keep module list mode active when leaving 3D
        }
        if (typeof window.updateBottomToolbarGroups === 'function') {
            window.updateBottomToolbarGroups();
        }
    } catch (error) {
        alert("Wystąpił błąd silnika 3D: " + error.message);
        console.error("Szczegóły błędu 3D:", error);
    }
}

// Global helper: re-populates legend panel after programmatic update3DScene() calls
window.refreshBlueprintLegend = function () {
    const panel = document.getElementById('blueprintLegend');
    if (!panel) return;
    if (!showDimensions || !window.blueprintLegendItems || !window.blueprintDimensions) {
        panel.style.display = 'none';
        return;
    }
    const dim = window.blueprintDimensions;
    const dimsEl = document.getElementById('blDims');
    if (dimsEl) {
        let html =
            '<div class="bl-dim-row"><span class="bl-dim-label">Szerokość</span><span class="bl-dim-value">' + dim.W + ' cm</span></div>' +
            '<div class="bl-dim-row"><span class="bl-dim-label">Wysokość</span><span class="bl-dim-value">' + dim.H + ' cm</span></div>';
        if (dim.D) {
            html += '<div class="bl-dim-row"><span class="bl-dim-label">Głębokość</span><span class="bl-dim-value">' + dim.D + ' cm</span></div>';
        }
        html += '<div class="bl-dim-row"><span class="bl-dim-label">System</span><span class="bl-dim-value" style="font-size:12px;">' + dim.sys + '</span></div>';
        dimsEl.innerHTML = html;
    }
    const listEl = document.getElementById('blList');
    if (listEl) {
        listEl.innerHTML = window.blueprintLegendItems.map(function (item) {
            return '<div class="bl-item">' +
                '<div class="bl-badge" style="background:' + item.color + ';">' + item.num + '</div>' +
                '<div class="bl-item-text">' +
                '<div class="bl-item-name">' + item.name + '</div>' +
                (item.desc ? '<div class="bl-item-desc">' + item.desc + '</div>' : '') +
                '</div></div>';
        }).join('');
    }
    panel.style.display = 'flex';
};


function toggleFab() {
    const subs = document.getElementById('fabSubs');
    if (subs) subs.style.display = (subs.style.display === 'flex') ? 'none' : 'flex';
}

function openBugModal() {
    toggleFab();
    const modal = document.getElementById('ticketModal');
    if (modal) modal.style.display = 'flex';
}

function closeDataModal() {
    const modal = document.getElementById('dataViewModal');
    if (modal) modal.style.display = 'none';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const icon = document.getElementById('sidebarToggleIcon');
    const ghost = document.getElementById('sidebarGhost');

    if (!sidebar) return;

    sidebar.classList.remove('surge');
    void sidebar.offsetWidth;
    sidebar.classList.add('surge');

    sidebar.classList.toggle('collapsed');
    if (toggleBtn) toggleBtn.classList.toggle('collapsed');

    if (ghost) {
        ghost.classList.toggle('collapsed');
    }

    if (icon) {
        if (sidebar.classList.contains('collapsed')) {
            icon.innerText = '▶';
        } else {
            icon.innerText = '◀';
        }
    }

    setTimeout(() => window.dispatchEvent(new Event('resize')), 600);
}

function toggleBottomToolbar() {
    const toolbar = document.getElementById('bottomToolbar');
    const toggleBtn = document.getElementById('bottomToolbarToggleBtn');
    const icon = document.getElementById('bottomToolbarToggleIcon');

    if (!toolbar) return;

    toolbar.classList.toggle('collapsed');
    if (toggleBtn) toggleBtn.classList.toggle('collapsed');

    if (icon) {
        if (toolbar.classList.contains('collapsed')) {
            icon.innerText = '▲';
        } else {
            icon.innerText = '▼';
        }
    }

    setTimeout(() => window.dispatchEvent(new Event('resize')), 600);
}



function toggleCategory(id, headerEl) {
    const content = document.getElementById(id);
    if (!content || !headerEl) return;
    const arrow = headerEl.querySelector('.cat-arrow');

    if (!arrow) return;

    headerEl.classList.remove('category-flash');
    void headerEl.offsetWidth;
    headerEl.classList.add('category-flash');

    content.classList.toggle('collapsed');
    arrow.classList.toggle('collapsed');

    if (content.classList.contains('collapsed')) {
        headerEl.classList.remove('active');
    } else {
        headerEl.classList.add('active');
    }

    arrow.style.color = '#fff';
    arrow.style.textShadow = '0 0 15px #fff, 0 0 30px var(--warp-color, var(--highlight))';
    setTimeout(() => {
        arrow.style.color = '';
        arrow.style.textShadow = '';
    }, 150);
}

function switchSystem(newSystem) {
    if (currentSystem === newSystem) return;

    const stage = document.getElementById('stage');
    if (stage) {
        stage.style.filter = 'brightness(3) blur(10px) hue-rotate(90deg)';
        setTimeout(() => stage.style.filter = '', 300);
    }

    if (typeof plan !== 'undefined' && plan.length > 0) {
        if (!confirm("Zmiana systemu wymaga wyczyszczenia obecnego projektu ze względu na inne metody łączenia. Kontynuować?")) {
            const selector = document.getElementById('systemSelector');
            if (selector) selector.value = currentSystem;
            return;
        }
        plan = [];
        if (typeof undoHistory !== 'undefined') undoHistory = [];
    }

    currentSystem = newSystem;

    const blockedSystems = ['multiframe', 'Flex_noLEd', 'adframe', 'SEGO_2_0'];
    const isBlocked = blockedSystems.includes(newSystem);
    const overlay = document.getElementById('constructionOverlay');
    if (overlay) {
        overlay.style.display = isBlocked ? 'flex' : 'none';
    }
    if (isBlocked && typeof is3DMode !== 'undefined' && is3DMode && typeof toggle3D === 'function') {
        toggle3D();
    }

    if (isBlocked) {
        const collapsible = document.getElementById('sidebar-collapsible-content');
        if (collapsible) collapsible.style.display = 'none';

        const wypPanel = document.getElementById('panel-wyposazenie-dodatkowe');
        if (wypPanel) wypPanel.style.display = 'none';

        const allPanels = document.querySelectorAll('.system-ui-panel');
        allPanels.forEach(p => p.style.display = 'none');

        const btnRadial = document.getElementById('btnToggleRadial');
        if (btnRadial) btnRadial.style.display = 'none';
        const btnSpakuj = document.getElementById('btnSpakuj');
        if (btnSpakuj) btnSpakuj.style.display = 'none';
        const btnRand = document.getElementById('btnRandomizeGraphics');
        if (btnRand) btnRand.style.display = 'none';
        const btnMagnet = document.getElementById('btnMagnetPull');
        if (btnMagnet) btnMagnet.style.display = 'none';
        const btnToggleDimensions = document.getElementById('btnToggleDimensions');
        if (btnToggleDimensions) btnToggleDimensions.style.display = 'none';
        const btnModuleList = document.getElementById('btnModuleList');
        if (btnModuleList) btnModuleList.style.display = 'none';
        if (typeof showModuleListMode !== 'undefined' && showModuleListMode) {
            toggleModuleListMode();
        }

        const wydrukiBtns = ['btnWydrukiReport', 'btnWydrukiMatch', 'btnWydrukiClearStage', 'btnClearWydruki', 'btnWydrukiImport', 'btnWydrukiAnalyze'];
        wydrukiBtns.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        const btnCorners = document.getElementById('btnAutoResolveCorners');
        if (btnCorners) btnCorners.style.display = 'none';
        if (typeof window.updateBottomToolbarGroups === 'function') {
            window.updateBottomToolbarGroups();
        }

        if (typeof render === 'function') render();
        console.log("🚀 System switched to BLOCKED: " + newSystem);
        return;
    }

    if (currentSystem === 'LMSM') {
        window.currentSystemConfig = { prefix: "LMSM", defWidth: 100, defHeight: 250, cornerType: "BI_FOLD_SLIM", neonColorHex: 0x00FF88 };
        if (typeof clearPlan === 'function') clearPlan();
        if (typeof updateFoldableRadialMenus === 'function') updateFoldableRadialMenus(camera, renderer);
    }

    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement) {
        if (currentSystem === 'foldable') {
            sidebarElement.classList.add('foldable-theme');
            sidebarElement.classList.remove('lmsm-theme');
        } else if (currentSystem === 'LMSM') {
            sidebarElement.classList.add('lmsm-theme');
            sidebarElement.classList.remove('foldable-theme');
        } else {
            sidebarElement.classList.remove('foldable-theme');
            sidebarElement.classList.remove('lmsm-theme');
        }
    }

    if (typeof updateThemeColors === 'function') {
        updateThemeColors(currentSystem);
    }

    const btnRadial = document.getElementById('btnToggleRadial');
    if (btnRadial) {
        btnRadial.style.display = (is3DMode && (currentSystem === 'foldable' || currentSystem === 'LMSM')) ? 'flex' : 'none';
    }

    const btnSpakuj = document.getElementById('btnSpakuj');
    if (btnSpakuj) {
        btnSpakuj.style.display = (is3DMode && newSystem === 'kasetony_niestandardowe') ? 'flex' : 'none';
        if (newSystem !== 'kasetony_niestandardowe') {
            window.isKasetonPackedMode = false;
            btnSpakuj.classList.remove('packed');
            btnSpakuj.innerHTML = '📦 Spakuj';
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 🔥 NOWOŚĆ: Automatyczna kontrola widoczności przycisku losowania grafik
    // ═══════════════════════════════════════════════════════════
    const btnRand = document.getElementById('btnRandomizeGraphics');
    if (btnRand) {
        btnRand.style.display = (is3DMode && !['wydruki', 'mframe_pallet'].includes(newSystem)) ? 'flex' : 'none';
    }

    const btnMagnet = document.getElementById('btnMagnetPull');
    if (btnMagnet) {
        btnMagnet.style.display = is3DMode ? 'none' : 'flex';
    }

    const btnToggleDimensions = document.getElementById('btnToggleDimensions');
    if (btnToggleDimensions) {
        btnToggleDimensions.style.display = 'flex';
    }
    const btnModuleList = document.getElementById('btnModuleList');
    if (btnModuleList) {
        btnModuleList.style.display = 'flex';
    }
    const btnCorners = document.getElementById('btnAutoResolveCorners');
    if (btnCorners) {
        btnCorners.style.display = is3DMode ? 'none' : 'flex';
    }
    if (typeof window.updateBottomToolbarGroups === 'function') {
        window.updateBottomToolbarGroups();
    }

    const allPanels = document.querySelectorAll('.system-ui-panel');
    allPanels.forEach(p => p.style.display = 'none');

    const collapsible = document.getElementById('sidebar-collapsible-content');
    if (collapsible) {
        collapsible.style.display = (newSystem === 'wydruki' || newSystem === 'prompt_generator') ? 'none' : 'block';
    }

    const projectDetails = document.getElementById('sidebar-project-details');
    if (projectDetails) {
        projectDetails.style.display = (newSystem === 'prompt_generator') ? 'none' : 'block';
    }

    const promptControls = document.getElementById('ui-prompt-sidebar-controls');
    if (promptControls) {
        promptControls.style.display = (newSystem === 'prompt_generator') ? 'block' : 'none';
        if (newSystem === 'prompt_generator' && typeof window.onPromptTypeChange === 'function') {
            window.onPromptTypeChange();
        }
    }

    if (typeof window.togglePromptGeneratorMode === 'function') {
        window.togglePromptGeneratorMode(newSystem === 'prompt_generator');
    }

    // Wyposażenie Dodatkowe — widoczne dla wszystkich aktywnych systemów z builderem
    const wypPanel = document.getElementById('panel-wyposazenie-dodatkowe');
    if (wypPanel) {
        const hideWyp = (newSystem === 'wydruki' || newSystem === 'mframe_pallet' || newSystem === 'prompt_generator');
        wypPanel.style.display = hideWyp ? 'none' : 'block';
    }

    const wydrukiBtns = ['btnWydrukiReport', 'btnWydrukiMatch', 'btnWydrukiClearStage', 'btnClearWydruki', 'btnWydrukiImport', 'btnWydrukiAnalyze'];
    wydrukiBtns.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (newSystem === 'wydruki') ? 'flex' : 'none';
    });
    if (typeof window.updateBottomToolbarGroups === 'function') {
        window.updateBottomToolbarGroups();
    }

    const targetPanel = document.getElementById('ui-system-' + newSystem);
    if (targetPanel) {
        targetPanel.style.display = 'block';
        targetPanel.classList.add('category-flash');
        setTimeout(() => targetPanel.classList.remove('category-flash'), 500);
    }

    if (typeof redefineSystemRules === 'function') {
        redefineSystemRules(newSystem);
    }

    if (typeof render === 'function') render();
    if (typeof is3DMode !== 'undefined' && is3DMode && typeof update3DScene === 'function') {
        update3DScene();
    }

    console.log("🚀 System switched to: " + newSystem + " (Theme updated)");

    if (newSystem === 'mframe_pallet' && typeof is3DMode !== 'undefined' && !is3DMode) {
        if (typeof toggle3D === 'function') toggle3D();
    }

    if (newSystem === 'kasetony_niestandardowe') {
        if (typeof syncKasetonUiFromConfig === 'function') {
            syncKasetonUiFromConfig();
        }
        setTimeout(() => {
            if (typeof openKasetonModal === 'function') openKasetonModal();
        }, 400);
    }
}
function toggleRadialMenus() {
    radialMenusVisible = !radialMenusVisible;
    const layer = document.getElementById('foldable-ui-layer');
    const btn = document.getElementById('btnToggleRadial');
    if (!layer || !btn) return;

    btn.classList.toggle('active', radialMenusVisible);
    if (radialMenusVisible) {
        layer.style.display = 'block';
        btn.innerHTML = '⚙️ Konfigurator';
    } else {
        layer.style.display = 'none';
        btn.innerHTML = '⚙️ Ukryto menu';
    }
}

function toggleNightMode() {
    isNightMode = !isNightMode;
    const btn = document.getElementById('btnNightMode');
    const ambSlider = document.getElementById('ambLightSlider');
    const dirSlider = document.getElementById('dirLightSlider');
    if (!btn || !ambSlider || !dirSlider) return;

    if (isNightMode) {
        originalAmbient = ambSlider.value;
        originalSun = dirSlider.value;

        ambSlider.value = 0.05;
        dirSlider.value = 0.1;

        setSceneBg('black');

        btn.innerHTML = "☀️ Tryb Dzienny";
        btn.style.background = "#ffcc00";
        btn.style.color = "#000";
        btn.style.boxShadow = "0 0 15px rgba(255, 204, 0, 0.5)";
    } else {
        ambSlider.value = originalAmbient;
        dirSlider.value = originalSun;

        setSceneBg(typeof isBlueprintMode !== 'undefined' && isBlueprintMode ? 'blue' : 'white');

        btn.innerHTML = "🌙 Tryb Nocny";
        btn.style.background = "#2c3e50";
        btn.style.color = "#fff";
        btn.style.boxShadow = "none";
    }

    if (typeof updateLighting === 'function') updateLighting();
    if (typeof updateWallEmissive === 'function') updateWallEmissive();
}

function toggleDpdAllServices() {
    const allDiv = document.getElementById('dpd-all-services');
    const toggleDiv = document.getElementById('dpd-toggle-all');
    if (!allDiv || !toggleDiv) return;
    if (allDiv.classList.contains('expanded')) {
        allDiv.classList.remove('expanded');
        toggleDiv.textContent = '▼ Pokaż wszystkie usługi';
    } else {
        allDiv.classList.add('expanded');
        toggleDiv.textContent = '▲ Ukryj wszystkie usługi';
    }
}

function downloadNodeInstaller() {
    const batContent = `@echo off
:: Kodowanie UTF-8
chcp 65001 >nul
title Instalator Node.js & DPD Proxy

echo ===================================================
echo       Automatyczny Instalator Node.js i DPD
echo ===================================================
echo.
echo Krok 1: Sprawdzanie czy Node.js jest juz zainstalowany...
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js jest juz zainstalowany.
    goto run_proxy
)

echo [INFO] Brak Node.js. Rozpoczynam instalacje za pomoca winget...
winget --version >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Uzywam systemowego menedzera pakietow winget...
    winget install --id OpenJS.NodeJS --silent --accept-package-agreements --accept-source-agreements
    if %errorlevel% neq 0 (
        echo [BLAD] Instalacja winget nie powiodla sie. Probuje pobrac instalator MSI...
        goto download_msi
    )
    echo [OK] Instalacja Node.js zakonczona sukcesem!
    goto refresh_path
) else (
    goto download_msi
)

:download_msi
echo [INFO] Pobieranie oficjalnego instalatora Node.js MSI za pomoca PowerShell...
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile 'node_installer.msi'"
if not exist node_installer.msi (
    echo [BLAD] Nie udalo sie pobrac instalatora Node.msi. Pobierz go recznie z nodejs.org
    pause
    exit /b 1
)
echo [INFO] Uruchamianie instalatora MSI... Prosze przejsc przez kreator instalacji.
msiexec /i node_installer.msi
del node_installer.msi
echo [OK] Instalator MSI zakonczyl prace.
goto refresh_path

:refresh_path
echo [INFO] Odswiezanie zmiennych srodowiskowych PATH...
for /f "tokens=2* delims= " %%a in ('reg query "HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path') do set "syspath=%%b"
for /f "tokens=2* delims= " %%a in ('reg query "HKCU\\Environment" /v Path') do set "usrpath=%%b"
set "PATH=%syspath%;%usrpath%"
echo.

:run_proxy
echo Krok 2: Uruchamianie serwera DPD proxy (dpd-proxy.js)...
echo ===================================================
node dpd-proxy.js
if %errorlevel% neq 0 (
    echo.
    echo [BLAD] Nie udalo sie uruchomic serwera. Upewnij sie, ze jestes w folderze z plikiem dpd-proxy.js.
    echo Aktualny folder: %cd%
)
pause
`;

    const blob = new Blob([batContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Instaluj_NodeJS_i_Uruchom.bat';
    document.body.appendChild(a);
    a.click();
    a.remove(); // Bezpieczne usunięcie z DOM
    URL.revokeObjectURL(url);
}

function openKasetonModal() {
    const modal = document.getElementById('kasetonModal');
    if (modal) {
        modal.style.display = 'flex';
        const inner = modal.querySelector('.kaseton-modal-inner');
        if (inner) {
            inner.style.animation = 'none';
            void inner.offsetWidth;
            inner.style.animation = '';
        }
    }
    if (typeof syncKasetonUiFromConfig === 'function') {
        syncKasetonUiFromConfig();
    }
}

function closeKasetonModal() {
    const modal = document.getElementById('kasetonModal');
    if (modal) modal.style.display = 'none';
}

function onKasetonSystemChange(sel) {
    if (!sel) return;
    const sys = sel.value;
    const root = document.documentElement;
    const isCTF = (sys === 'CTF' || sys === 'CTF_LED');

    if (typeof KASETON_NEON_MAP !== 'undefined' && KASETON_NEON_MAP[sys]) {
        const map = KASETON_NEON_MAP[sys];
        root.style.setProperty('--kaseton-neon', map.neon);
        root.style.setProperty('--kaseton-neon-alpha', map.alpha.replace('@@', '0.3'));
    } else {
        root.style.setProperty('--kaseton-neon', '#00e5ff');
        root.style.setProperty('--kaseton-neon-alpha', 'rgba(0, 229, 255, 0.3)');
    }

    if (typeof kasetonAfterglowTrigger === 'function') kasetonAfterglowTrigger(sel);

    if (typeof KASETON_LED_SYSTEMS !== 'undefined') {
        const isLED = KASETON_LED_SYSTEMS.includes(sys);
        const powerSec = document.getElementById('kasetonPowerSection');
        const lightSec = document.getElementById('kasetonLightSection');
        const cableExitSec = document.getElementById('kasetonCableExitSection');

        if (powerSec) {
            if (isLED) powerSec.classList.add('visible');
            else powerSec.classList.remove('visible');
        }
        if (lightSec) {
            if (isLED) lightSec.classList.add('visible');
            else lightSec.classList.remove('visible');
        }
        if (cableExitSec) {
            if (isLED) cableExitSec.classList.add('visible');
            else cableExitSec.classList.remove('visible');
        }

        if (!isLED) {
            const cableExitSelect = document.getElementById('kasetonCableExit');
            if (cableExitSelect) {
                cableExitSelect.value = 'back_print';
                if (typeof window.onKasetonCableExitChange === 'function') {
                    window.onKasetonCableExitChange(cableExitSelect);
                }
            }
        }
    }

    // Aktualizacja opcji oświetlenia dla CTF LED
    updateKasetonLightOptions();

    // CTF and LCD_LMD-specific sections: 3rd dimension
    const heightSec = document.getElementById('kasetonHeightSection');
    const topSec = document.getElementById('kasetonTopSection');
    if (heightSec) {
        if (isCTF || sys === 'LCD_LMD') {
            heightSec.classList.add('visible');
            const label = heightSec.querySelector('.kaseton-label');
            if (label) {
                if (sys === 'LCD_LMD') {
                    label.innerHTML = '<span class="kaseton-badge">2b</span> Głębokość 3D (LCD LMD)';
                } else {
                    label.innerHTML = '<span class="kaseton-badge">2b</span> Głębokość 3D (CTF)';
                }
            }
        } else {
            heightSec.classList.remove('visible');
        }
    }
    if (topSec) {
        if (isCTF) topSec.classList.add('visible');
        else topSec.classList.remove('visible');
    }

    // CTF: cut section is now allowed
    const cutSec = document.getElementById('kasetonCut');
    if (cutSec) {
        const cutParent = cutSec.closest('.kaseton-section');
        if (cutParent) cutParent.style.display = '';
    }

    // CTF / LMD / LCD_LMD: restrict usage options
    const usageEl = document.getElementById('kasetonUsage');
    if (usageEl) {
        if (isCTF) {
            usageEl.innerHTML = '<option value="freestanding">Wolnostojący (Stopy)</option>' +
                '<option value="suspended">Podwieszany (Linki)</option>';
        } else if (sys === 'LMD' || sys === 'LCD_LMD') {
            usageEl.innerHTML = '<option value="freestanding">Wolnostojący (Stopy)</option>' +
                '<option value="suspended">Podwieszany (Linki)</option>';
        } else if (sys === 'STF' || sys === 'STFL') {
            usageEl.innerHTML = '<option value="wall" selected>Naścienny</option>' +
                '<option value="suspended">Podwieszany</option>' +
                '<option value="none">Bez montażu</option>';
        } else if (sys === 'DTF') {
            usageEl.innerHTML = '<option value="freestanding" selected>Wolnostojący - stopy płaskie</option>' +
                '<option value="freestanding_tri">Wolnostojący - stopy trójkątne</option>' +
                '<option value="suspended">Podwieszany</option>' +
                '<option value="none">Bez montażu</option>';
        } else {
            usageEl.innerHTML = '<option value="freestanding">Wolnostojący (Stopy)</option>' +
                '<option value="suspended">Podwieszany (Linki)</option>' +
                '<option value="wall">Naścienny</option>';
        }
    }

    // CTF and LCD_LMD: adjust dimension limits and set defaults to 200x200x200
    const widthEl = document.getElementById('kasetonWidth');
    const depthEl = document.getElementById('kasetonDepth');
    const height3DEl = document.getElementById('kasetonHeight3D');
    const is3D = (sys === 'CTF' || sys === 'CTF_LED' || sys === 'LCD_LMD');
    
    if (is3D) {
        if (widthEl && (widthEl.value === '100' || widthEl.value === '120' || widthEl.value === '')) widthEl.value = '200';
        if (depthEl && (depthEl.value === '200' || depthEl.value === '')) depthEl.value = '200';
        if (height3DEl && (height3DEl.value === '120' || height3DEl.value === '')) height3DEl.value = '200';
    }

    if (sys === 'CTF') {
        if (widthEl) { widthEl.min = 25; widthEl.max = 800; }
        if (depthEl) { depthEl.min = 25; depthEl.max = 800; }
        if (height3DEl) { height3DEl.min = 25; height3DEl.max = 800; }
    } else if (sys === 'CTF_LED') {
        if (widthEl) { widthEl.min = 30; widthEl.max = 800; }
        if (depthEl) { depthEl.min = 30; depthEl.max = 800; }
        if (height3DEl) { height3DEl.min = 30; height3DEl.max = 800; }
    } else if (sys === 'LCD_LMD') {
        if (widthEl) { widthEl.min = 40; widthEl.max = 1000; }
        if (depthEl) { depthEl.min = 40; depthEl.max = 1000; }
        if (height3DEl) { height3DEl.min = 30; height3DEl.max = 800; }
    } else {
        if (widthEl) { widthEl.min = 40; widthEl.max = 1000; }
        if (depthEl) { depthEl.min = 40; depthEl.max = 1000; }
    }

    // Dynamiczne opcje wydruku zależne od systemu
    var printSel = document.getElementById('kasetonPrint');
    if (printSel) {
        printSel.innerHTML = '';
        if (isCTF) {
            // CTF/CTF_LED: print options for 4, 5, 6 sides, default is 6 sides
            printSel.innerHTML = '<option value="6_sides" selected>Wydruk na 6 ścian</option>' +
                '<option value="4_sides">Wydruk na 4 ściany</option>' +
                '<option value="5_sides_top_open">Wydruk na 5 ścian (otwarta góra)</option>' +
                '<option value="5_sides_bottom_open">Wydruk na 5 ścian (otwarty dół)</option>' +
                '<option value="no_print">Bez wydruku (sama rama)</option>';
        } else if (sys === 'LCD_LMD') {
            // LCD_LMD: specific double/single fabric graphics options
            printSel.innerHTML = '<option value="double_divided" selected>obustronny backlit dzielony (domyślny)</option>' +
                '<option value="double_wrapping">obustronny backlit przechodzący</option>' +
                '<option value="front_divided_back_blockout">backlit front dzielony+ blockout tył</option>' +
                '<option value="front_wrapping_back_blockout">backlit front przechodzący+ blockout tył</option>' +
                '<option value="no_print">bez wydruku</option>';
        } else if (sys === 'LMS' || sys === 'LMSM') {
            // LMS / LMSM: kaseton jednostronny - ograniczone opcje
            printSel.innerHTML = '<option value="backlit_white" selected>Przód backlit + Tył białe plecy</option>' +
                '<option value="backlit_blockout">Przód backlit + Tył kolorowy blockout</option>' +
                '<option value="back_white">Tylko białe plecy</option>' +
                '<option value="no_print">Bez wydruku (sama rama)</option>';
        } else if (sys === 'STF' || sys === 'STFL') {
            // STF/STFL: frontowy blockout lub bez wydruku
            printSel.innerHTML = '<option value="front_blockout" selected>frontowy blockout</option>' +
                '<option value="no_print">bez wydruku</option>';
        } else if (sys === 'DTF') {
            // DTF: obustronny blockout lub bez wydruku
            printSel.innerHTML = '<option value="double_blockout" selected>obustronny blockout</option>' +
                '<option value="no_print">bez wydruku</option>';
        } else {
            // LMD i inne: pełne opcje dwustronne
            printSel.innerHTML = '<option value="single">Jednostronny + Blockout tył</option>' +
                '<option value="double">Dwustronny (2x wydruk)</option>' +
                '<option value="front_blockout">Przód Wydruk, Tył Blockout biały</option>' +
                '<option value="back_blockout">Tylko Blockout tył</option>' +
                '<option value="no_print">Bez wydruku (sama rama)</option>';
        }
        
        // Restore value if it exists in the new options list
        if (window.currentKasetonConfig && window.currentKasetonConfig.print) {
            const exists = Array.from(printSel.options).some(opt => opt.value === window.currentKasetonConfig.print);
            if (exists) {
                printSel.value = window.currentKasetonConfig.print;
            }
        }
    }

    console.log('🔲 Kaseton system changed to:', sys);

    // Update custom cut configuration buttons visibility
    const cutEl = document.getElementById('kasetonCut');
    if (cutEl && typeof onKasetonCutChange === 'function') {
        const showCustom = (cutEl.value === 'custom');
        const btnCustomCut = document.getElementById('btnConfigureCustomCut');
        const btnCTFFrontBack = document.getElementById('btnConfigureCustomCTFFrontBack');
        const btnCTFLeftRight = document.getElementById('btnConfigureCustomCTFLeftRight');
        const btnCTFTopBottom = document.getElementById('btnConfigureCustomCTFTopBottom');
        
        if (btnCustomCut) btnCustomCut.style.display = (showCustom && !isCTF) ? 'block' : 'none';
        if (btnCTFFrontBack) btnCTFFrontBack.style.display = (showCustom && isCTF) ? 'block' : 'none';
        if (btnCTFLeftRight) btnCTFLeftRight.style.display = (showCustom && isCTF) ? 'block' : 'none';
        if (btnCTFTopBottom) btnCTFTopBottom.style.display = (showCustom && isCTF) ? 'block' : 'none';
    }
}

window.onKasetonCableExitChange = function(sel) {
    if (!sel) return;
    const val = sel.value;
    const container = document.getElementById('kasetonCableDrillValContainer');
    const label = document.getElementById('kasetonCableDrillLabel');
    const input = document.getElementById('kasetonCableDrillVal');
    
    if (!container || !label || !input) return;
    
    if (val === 'drill_top' || val === 'drill_bottom') {
        container.style.display = 'flex';
        label.innerText = 'odległość od lewej krawędzi (mm)';
    } else if (val === 'drill_left' || val === 'drill_right') {
        container.style.display = 'flex';
        label.innerText = 'odległość od dolnej krawędzi (mm)';
    } else {
        container.style.display = 'none';
        input.value = '';
    }
};

function updateKasetonLightOptions() {
    const sysEl = document.getElementById('kasetonSystem');
    const topEl = document.getElementById('kasetonTop');
    const lightEl = document.getElementById('kasetonLight');
    if (!sysEl || !lightEl) return;

    const sys = sysEl.value;
    const topVal = topEl ? topEl.value : 'none';
    const currentVal = lightEl.value;

    if (sys === 'CTF_LED') {
        let html = '';
        html += '<option value="zarowka">żarówka</option>';
        html += '<option value="plafon_dol">Plafon LED (dół)</option>';
        html += '<option value="plafon_gora">Plafon LED (góra)</option>';
        html += '<option value="plafon_gora_dol">Plafon LED (góra + dół)</option>';
        if (topVal === 'mdf') {
            html += '<option value="paski_led">paski LED obwodowo pod blatem</option>';
        }
        lightEl.innerHTML = html;

        // Przywróć poprzednią wartość jeśli wciąż istnieje
        if (html.includes('value="' + currentVal + '"')) {
            lightEl.value = currentVal;
        } else {
            lightEl.value = 'zarowka';
        }
    } else if (sys === 'LCD_LMD') {
        let html = '';
        html += '<option value="top_bottom">góra+dół</option>';
        html += '<option value="bottom_only">tylko dół</option>';
        html += '<option value="top_only">tylko góra</option>';
        lightEl.innerHTML = html;

        if (['top_bottom', 'bottom_only', 'top_only'].includes(currentVal)) {
            lightEl.value = currentVal;
        } else {
            lightEl.value = 'top_bottom';
        }
    } else {
        // Standardowe opcje LED
        lightEl.innerHTML = `
            <option value="power_long">Krawędziowo - Długie boki</option>
            <option value="power_short">Krawędziowo - Krótkie boki</option>
            <option value="power_around">Po obwodzie (Wszystkie 4 boki)</option>
        `;
        if (['power_long', 'power_short', 'power_around'].includes(currentVal)) {
            lightEl.value = currentVal;
        } else {
            lightEl.value = 'power_long';
        }
    }
}

function kasetonAfterglowTrigger(el) {
    if (!el) return;
    el.classList.remove('afterglow');
    void el.offsetWidth;
    el.classList.add('afterglow');
    setTimeout(() => el.classList.remove('afterglow'), 700);
}

function submitKasetonConfig() {
    const sysEl = document.getElementById('kasetonSystem');
    const widthEl = document.getElementById('kasetonWidth');
    const depthEl = document.getElementById('kasetonDepth');

    if (!sysEl || !widthEl || !depthEl) return;

    const sys = sysEl.value;
    const width = parseInt(widthEl.value);
    const depth = parseInt(depthEl.value);

    const cutEl = document.getElementById('kasetonCut');
    const printEl = document.getElementById('kasetonPrint');
    const usageEl = document.getElementById('kasetonUsage');

    const cut = cutEl ? cutEl.value : '';
    const print = printEl ? printEl.value : '';
    const usage = usageEl ? usageEl.value : '';

    const isCTF = (sys === 'CTF' || sys === 'CTF_LED');
    let minDim = 40;
    if (sys === 'CTF') minDim = 25;
    else if (sys === 'CTF_LED') minDim = 30;
    const maxDim = isCTF ? 800 : 1000;

    if (!sys) {
        alert('⚠️ Wybierz system kasetonu!');
        sysEl.focus();
        return;
    }
    if (isNaN(width) || width < minDim || width > maxDim) {
        alert('⚠️ Szerokość musi być w zakresie ' + minDim + '–' + maxDim + ' cm!');
        widthEl.focus();
        return;
    }
    if (isNaN(depth) || depth < minDim || depth > maxDim) {
        alert('⚠️ Wysokość musi być w zakresie ' + minDim + '–' + maxDim + ' cm!');
        depthEl.focus();
        return;
    }

    const coatingEl = document.getElementById('kasetonCoating');
    const ralEl = document.getElementById('kasetonRal');
    const coating = coatingEl ? coatingEl.value : 'none';
    const ral = (coatingEl && coating !== 'none' && ralEl) ? ralEl.value.trim() : '';

    if (coating.includes('custom') && !ral) {
        alert('⚠️ Podaj numer RAL dla malowania niestandardowego!');
        if (ralEl) ralEl.focus();
        return;
    }

    const packingEl = document.getElementById('kasetonPacking');
    const packing = packingEl ? packingEl.value : 'kartony';

    const config = {
        system: sys,
        width: width,
        depth: depth,
        cut: cut,
        print: print,
        usage: usage,
        coating: coating,
        ral: ral,
        packing: packing
    };

    if (cut === 'custom') {
        if (window.currentKasetonConfig && window.currentKasetonConfig.customSupports) {
            let cs = JSON.parse(JSON.stringify(window.currentKasetonConfig.customSupports));
            if (isCTF) {
                cs.frontBack = cs.frontBack || { vertical: [], horizontal: [] };
                cs.leftRight = cs.leftRight || { vertical: [], horizontal: [] };
                cs.topBottom = cs.topBottom || { vertical: [], horizontal: [] };

                const height3D = parseInt(document.getElementById('kasetonHeight3D')?.value || 120);

                cs.frontBack.vertical = (cs.frontBack.vertical || []).map(vs => {
                    let pos = vs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > width - 5) pos = width - 5;
                    return { pos };
                });
                cs.frontBack.horizontal = (cs.frontBack.horizontal || []).map(hs => {
                    let pos = hs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > depth - 5) pos = depth - 5;
                    return { pos };
                });

                cs.leftRight.vertical = (cs.leftRight.vertical || []).map(vs => {
                    let pos = vs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > height3D - 5) pos = height3D - 5;
                    return { pos };
                });
                cs.leftRight.horizontal = (cs.leftRight.horizontal || []).map(hs => {
                    let pos = hs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > depth - 5) pos = depth - 5;
                    return { pos };
                });

                cs.topBottom.vertical = (cs.topBottom.vertical || []).map(vs => {
                    let pos = vs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > width - 5) pos = width - 5;
                    return { pos };
                });
                cs.topBottom.horizontal = (cs.topBottom.horizontal || []).map(hs => {
                    let pos = hs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > height3D - 5) pos = height3D - 5;
                    return { pos };
                });

                config.customSupports = cs;

                const lenFBV = cs.frontBack.vertical.length * (depth - 4.2426) * 2;
                const lenFBH = cs.frontBack.horizontal.length * (width - 4.2426) * 2;
                const lenLRV = cs.leftRight.vertical.length * (depth - 4.2426) * 2;
                const lenLRH = cs.leftRight.horizontal.length * (height3D - 4.2426) * 2;
                const lenTBV = cs.topBottom.vertical.length * (width - 4.2426) * 2;
                const lenTBH = cs.topBottom.horizontal.length * (height3D - 4.2426) * 2;

                config.totalSupportLengthM = (lenFBV + lenFBH + lenLRV + lenLRH + lenTBV + lenTBH) / 100;
                config.supportSegmentsCount = 
                    (cs.frontBack.vertical.length + cs.frontBack.horizontal.length) * 2 +
                    (cs.leftRight.vertical.length + cs.leftRight.horizontal.length) * 2 +
                    (cs.topBottom.vertical.length + cs.topBottom.horizontal.length) * 2;
            } else {
                cs.vertical = (cs.vertical || []).map(vs => {
                    let pos = vs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > width - 5) pos = width - 5;
                    return { pos: pos };
                });
                cs.horizontal = (cs.horizontal || []).map(hs => {
                    let pos = hs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > depth - 5) pos = depth - 5;
                    return { pos: pos };
                });
                config.customSupports = cs;
                const vLen = cs.vertical.length;
                const hLen = cs.horizontal.length;
                config.totalSupportLengthM = ((vLen * (depth - 5.4) + hLen * (width - 5.4)) / 100);
                config.supportSegmentsCount = vLen + hLen * (vLen + 1);
            }
        } else {
            config.customSupports = isCTF ? {
                frontBack: { vertical: [], horizontal: [] },
                leftRight: { vertical: [], horizontal: [] },
                topBottom: { vertical: [], horizontal: [] }
            } : { vertical: [], horizontal: [] };
            config.totalSupportLengthM = 0;
            config.supportSegmentsCount = 0;
        }

        if (window.currentKasetonConfig && window.currentKasetonConfig.customCuts) {
            let cc = JSON.parse(JSON.stringify(window.currentKasetonConfig.customCuts));
            if (isCTF) {
                cc.frontBack = cc.frontBack || { vertical: [], horizontal: [] };
                cc.leftRight = cc.leftRight || { vertical: [], horizontal: [] };
                cc.topBottom = cc.topBottom || { vertical: [], horizontal: [] };

                const height3D = parseInt(document.getElementById('kasetonHeight3D')?.value || 120);

                cc.frontBack.vertical = (cc.frontBack.vertical || []).map(vs => {
                    let pos = vs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > width - 5) pos = width - 5;
                    return { pos };
                });
                cc.frontBack.horizontal = (cc.frontBack.horizontal || []).map(hs => {
                    let pos = hs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > depth - 5) pos = depth - 5;
                    return { pos };
                });

                cc.leftRight.vertical = (cc.leftRight.vertical || []).map(vs => {
                    let pos = vs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > height3D - 5) pos = height3D - 5;
                    return { pos };
                });
                cc.leftRight.horizontal = (cc.leftRight.horizontal || []).map(hs => {
                    let pos = hs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > depth - 5) pos = depth - 5;
                    return { pos };
                });

                cc.topBottom.vertical = (cc.topBottom.vertical || []).map(vs => {
                    let pos = vs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > width - 5) pos = width - 5;
                    return { pos };
                });
                cc.topBottom.horizontal = (cc.topBottom.horizontal || []).map(hs => {
                    let pos = hs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > height3D - 5) pos = height3D - 5;
                    return { pos };
                });

                config.customCuts = cc;
            } else {
                cc.vertical = (cc.vertical || []).map(vs => {
                    let pos = vs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > width - 5) pos = width - 5;
                    return { pos: pos };
                });
                cc.horizontal = (cc.horizontal || []).map(hs => {
                    let pos = hs.pos;
                    if (pos < 5) pos = 5;
                    if (pos > depth - 5) pos = depth - 5;
                    return { pos: pos };
                });
                config.customCuts = cc;
            }
        } else {
            config.customCuts = isCTF ? {
                frontBack: { vertical: [], horizontal: [] },
                leftRight: { vertical: [], horizontal: [] },
                topBottom: { vertical: [], horizontal: [] }
            } : { vertical: [], horizontal: [] };
        }
    }

    // CTF and LCD_LMD-specific: 3rd dimension
    if (isCTF || sys === 'LCD_LMD') {
        const heightEl = document.getElementById('kasetonHeight3D');
        const height3D = heightEl ? parseInt(heightEl.value) : 120;
        const min3D = (sys === 'CTF') ? 25 : 30;
        if (isNaN(height3D) || height3D < min3D || height3D > 800) {
            alert('⚠️ Głębokość 3D musi być w zakresie ' + min3D + '–800 cm!');
            if (heightEl) heightEl.focus();
            return;
        }
        config.height3D = height3D;
        
        if (isCTF) {
            const topEl = document.getElementById('kasetonTop');
            config.topPanel = topEl ? topEl.value : 'none';
        }
    }

    const kasetonPowerEl = document.getElementById('kasetonPower');
    const kasetonLightEl = document.getElementById('kasetonLight');

    if (typeof KASETON_LED_SYSTEMS !== 'undefined' && KASETON_LED_SYSTEMS.includes(sys)) {
        config.power = kasetonPowerEl ? kasetonPowerEl.value : '';
        config.light = kasetonLightEl ? kasetonLightEl.value : '';
        
        const kasetonCableExitEl = document.getElementById('kasetonCableExit');
        const kasetonCableDrillValEl = document.getElementById('kasetonCableDrillVal');
        
        config.cableExit = kasetonCableExitEl ? kasetonCableExitEl.value : 'back_print';
        config.cableDrillVal = (kasetonCableDrillValEl && ['drill_top', 'drill_bottom', 'drill_left', 'drill_right'].includes(config.cableExit)) ? (parseInt(kasetonCableDrillValEl.value, 10) || 0) : '';
    }

    const warnings = checkKasetonWarnings(config);
    if (warnings.length > 0 && !window.ignoreWarningOnce) {
        showWarningModal(warnings[0]);
        return;
    }
    window.ignoreWarningOnce = false;

    console.log('✅ Kaseton configuration:', config);
    window.currentKasetonConfig = config;

    const btn = document.querySelector('.kaseton-submit');
    if (btn) {
        const origText = btn.textContent;
        btn.textContent = '✅ Zapisano konfigurację!';
        btn.style.background = 'var(--kaseton-neon)';
        btn.style.color = '#000';
        setTimeout(() => {
            btn.textContent = origText;
            btn.style.background = '';
            btn.style.color = '';
            closeKasetonModal();

            if (currentSystem !== 'kasetony_niestandardowe') {
                switchSystem('kasetony_niestandardowe');
            }

            if (!is3DMode) {
                toggle3D();
            } else {
                if (typeof update3DScene === 'function') update3DScene();
            }
        }, 800);
    }
}

function toggleSpakuj() {
    window.isKasetonPackedMode = !window.isKasetonPackedMode;
    const btn = document.getElementById('btnSpakuj');
    if (btn) {
        if (window.isKasetonPackedMode) {
            btn.innerHTML = '📦 Rozpakuj';
            btn.classList.add('packed');
        } else {
            btn.innerHTML = '📦 Spakuj';
            btn.classList.remove('packed');
        }
    }
    if (typeof update3DScene === 'function') update3DScene();
}
function updateMountingMenu(selectedSystem) {
    const usageSelect = document.getElementById('usageSelect') || document.getElementById('usageInput');
    if (!usageSelect) return;

    const previousValue = usageSelect.value;

    if (selectedSystem === 'LMSM') {
        usageSelect.innerHTML = `
      <option value="none">Bez montażu</option>
      <option value="wall">Wieszany na ścianie</option>
      <option value="suspended">Podwieszany</option>
    `;
        if (previousValue === 'freestanding') {
            usageSelect.value = 'none';
        } else {
            usageSelect.value = previousValue;
        }
    } else {
        usageSelect.innerHTML = `
      <option value="freestanding">Wolnostojący</option>
      <option value="wall">Wieszany na ścianie</option>
      <option value="suspended">Podwieszany</option>
    `;
        usageSelect.value = previousValue;
    }

    if (typeof updateConfigFromUI === 'function') updateConfigFromUI();
}

// Rozpoczęcie okresowego sprawdzania sesji w tle (co 2 minuty)
setInterval(function() {
    // Sprawdzamy sesję tylko jeśli użytkownik jest zalogowany (znana rola)
    if (currentUserRole) {
        fetch('Api/api_check_session.php')
            .then(response => {
                if (!response.ok) throw new Error('Network error or no PHP support');
                return response.json();
            })
            .then(data => {
                if (data && data.logged_in === false) {
                    console.warn("Sesja na serwerze wygasła. Pokazywanie ekranu logowania.");
                    if (typeof showNotification === 'function') {
                        showNotification("Sesja wygasła", "Twoja sesja wygasła. Zaloguj się ponownie, aby kontynuować zapisywanie na serwerze.");
                    }
                    // Wyświetlenie overlay bez czyszczenia danych
                    const overlay = document.getElementById('loginOverlay');
                    if (overlay) {
                        overlay.style.display = 'flex';
                    }
                }
            })
            .catch(err => {
                console.warn("Okresowe sprawdzanie sesji serwera pominięte (brak PHP / offline):", err);
            });
    }
}, 120000); // 120 000 ms = 2 minuty

// ==================== POWDER COATING UI LOGIC ====================
window.onCoatingChange = function(value, source) {
    const coatingEl = document.getElementById('kasetonCoating');
    if (coatingEl) coatingEl.value = value;

    const showRal = value !== 'none';
    const isCustom = value.includes('custom');
    const isStandard = value.includes('standard');

    const ralSecModal = document.getElementById('kasetonRalSection');
    if (ralSecModal) ralSecModal.style.display = showRal ? 'block' : 'none';

    if (showRal) {
        // Toggle manual input
        const manualModal = document.getElementById('kasetonRalManualContainer');
        if (manualModal) manualModal.style.display = isCustom ? 'flex' : 'none';

        // Toggle picker
        const pickerModal = document.getElementById('kasetonRalPicker');
        if (pickerModal) pickerModal.style.display = isStandard ? 'grid' : 'none';

        // Update labels
        const labelModal = document.getElementById('kasetonRalLabel');
        if (labelModal) {
            const badge = labelModal.querySelector('.kaseton-badge');
            labelModal.innerHTML = '';
            if (badge) labelModal.appendChild(badge);
            labelModal.appendChild(document.createTextNode(' ' + (isStandard ? 'Wybierz kolor standardowy' : 'Kolor RAL (Wymagany)')));
        }

        // Initialize pickers if standard
        if (isStandard) {
            window.initKasetonRalPickers();
            const currentRal = (window.currentKasetonConfig && window.currentKasetonConfig.ral) || '';
            const standardNames = ["RAL 9003", "RAL 9005", "RAL 9016", "RAL 9007", "RAL 7016", "RAL 7024", "RAL 9006", "RAL 3020", "RAL 3000", "RAL 1023", "RAL 7021"];
            if (!currentRal || !standardNames.includes(currentRal.toUpperCase())) {
                if (window.currentKasetonConfig) window.currentKasetonConfig.ral = 'RAL 7016';
                const inputModal = document.getElementById('kasetonRal');
                if (inputModal) inputModal.value = 'RAL 7016';
                window.updateKasetonRalPreviews('RAL 7016');
            } else {
                window.updateKasetonRalPreviews(currentRal);
            }
        } else if (isCustom) {
            const currentRal = (window.currentKasetonConfig && window.currentKasetonConfig.ral) || '';
            const inputModal = document.getElementById('kasetonRal');
            if (inputModal) inputModal.value = currentRal;
            window.updateKasetonRalPreviews(currentRal);
        }
    } else {
        if (window.currentKasetonConfig) {
            window.currentKasetonConfig.ral = '';
        }
    }
    
    // Save to active config
    if (window.currentKasetonConfig) {
        window.currentKasetonConfig.coating = value;
        // Trigger 3D update and BOM update
        if (typeof update3DScene === 'function') update3DScene();
    }
};

window.onKasetonPackingChange = function(value) {
    const packingEl = document.getElementById('kasetonPacking');
    if (packingEl) packingEl.value = value;

    if (window.currentKasetonConfig) {
        window.currentKasetonConfig.packing = value;
        // Trigger 3D update and BOM update
        if (typeof update3DScene === 'function') update3DScene();
    }
};

window.onRalInput = function(value, source) {
    const targetEl = document.getElementById('kasetonRal');
    if (targetEl) targetEl.value = value;

    window.updateKasetonRalPreviews(value);

    // Save to active config
    if (window.currentKasetonConfig) {
        window.currentKasetonConfig.ral = value;
        // Trigger 3D update and BOM update
        if (typeof update3DScene === 'function') update3DScene();
    }
};

window.initKasetonRalPickers = function() {
    const modalPicker = document.getElementById('kasetonRalPicker');
    if (modalPicker && modalPicker.children.length === 0) {
        buildPicker(modalPicker, 'modal');
    }
    
    function buildPicker(container, source) {
        const standardRals = [
            { name: "RAL 9003", label: "Signal White", hex: "#F4F4F4" },
            { name: "RAL 9005", label: "Jet Black", hex: "#0A0A0A" },
            { name: "RAL 9016", label: "Traffic White", hex: "#F6F6F6" },
            { name: "RAL 9007", label: "Grey Aluminium", hex: "#8F8F8C" },
            { name: "RAL 7016", label: "Anthracite Grey", hex: "#3B444B" },
            { name: "RAL 7024", label: "Graphite Grey", hex: "#454F56" },
            { name: "RAL 9006", label: "White Aluminium", hex: "#A1A1A1" },
            { name: "RAL 3020", label: "Traffic Red", hex: "#CC0605" },
            { name: "RAL 3000", label: "Flame Red", hex: "#A62421" },
            { name: "RAL 1023", label: "Traffic Yellow", hex: "#F8D501" },
            { name: "RAL 7021", label: "Black Grey", hex: "#2E3236" }
        ];

        standardRals.forEach(color => {
            const btn = document.createElement('div');
            btn.style.background = color.hex;
            const isLight = ["#F4F4F4", "#F6F6F6", "#F8D501", "#A1A1A1"].includes(color.hex);
            btn.style.color = isLight ? "#000" : "#fff";
            btn.style.padding = "4px";
            btn.style.borderRadius = "3px";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "9px";
            btn.style.fontWeight = "bold";
            btn.style.textAlign = "center";
            btn.style.border = "1px solid #555";
            btn.style.transition = "transform 0.15s, box-shadow 0.15s";
            
            btn.innerHTML = `<div style="font-size: 10px;">${color.name}</div>`;
            
            btn.onclick = () => {
                window.onRalInput(color.name, source);
            };

            btn.onmouseover = () => {
                btn.style.transform = "scale(1.05)";
                btn.style.boxShadow = "0 0 8px " + color.hex;
            };
            btn.onmouseout = () => {
                btn.style.transform = "none";
                btn.style.boxShadow = "none";
            };

            container.appendChild(btn);
        });
    }
};

window.updateKasetonRalPreviews = function(ralVal) {
    const previewModal = document.getElementById('kasetonRalColorPreview');
    const val = (ralVal || '').trim().toUpperCase();
    
    let hex = "#555";
    const db = window.RAL_DATABASE || {};
    
    let cleanKey = val.replace('RAL', '').trim();
    if (db[val]) {
        hex = db[val];
    } else if (db[cleanKey]) {
        hex = db[cleanKey];
    } else {
        const digitsMatch = val.match(/\d{4}/);
        if (digitsMatch && db[digitsMatch[0]]) {
            hex = db[digitsMatch[0]];
        } else if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
            hex = val;
        }
    }

    if (previewModal) previewModal.style.background = hex;

    const textModal = document.getElementById('kasetonSelectedRalValue');
    if (textModal) textModal.textContent = val || 'Brak';
};

window.syncKasetonUiFromConfig = function() {
    const config = window.currentKasetonConfig;
    if (!config) return;

    // Sync main layout fields
    const sysEl = document.getElementById('kasetonSystem');
    if (sysEl && config.system) {
        sysEl.value = config.system;
        onKasetonSystemChange(sysEl);
    }
    const widthEl = document.getElementById('kasetonWidth');
    if (widthEl && config.width !== undefined) widthEl.value = config.width;
    const depthEl = document.getElementById('kasetonDepth');
    if (depthEl && config.depth !== undefined) depthEl.value = config.depth;
    const height3DEl = document.getElementById('kasetonHeight3D');
    if (height3DEl && config.height3D !== undefined) height3DEl.value = config.height3D;
    const printEl = document.getElementById('kasetonPrint');
    if (printEl && config.print) printEl.value = config.print;
    const usageEl = document.getElementById('kasetonUsage');
    if (usageEl && config.usage) usageEl.value = config.usage;
    const packingEl = document.getElementById('kasetonPacking');
    if (packingEl && config.packing) packingEl.value = config.packing;

    const coating = config.coating || 'none';
    const ral = config.ral || '';

    const coatingEl = document.getElementById('kasetonCoating');
    if (coatingEl) coatingEl.value = coating;

    const ralEl = document.getElementById('kasetonRal');
    if (ralEl) ralEl.value = ral;

    const showRal = coating !== 'none';
    const isCustom = coating.includes('custom');
    const isStandard = coating.includes('standard');

    const ralSecModal = document.getElementById('kasetonRalSection');
    if (ralSecModal) ralSecModal.style.display = showRal ? 'block' : 'none';

    if (showRal) {
        // Toggle manual input
        const manualModal = document.getElementById('kasetonRalManualContainer');
        if (manualModal) manualModal.style.display = isCustom ? 'flex' : 'none';

        // Toggle picker
        const pickerModal = document.getElementById('kasetonRalPicker');
        if (pickerModal) pickerModal.style.display = isStandard ? 'grid' : 'none';

        // Update labels
        const labelModal = document.getElementById('kasetonRalLabel');
        if (labelModal) {
            const badge = labelModal.querySelector('.kaseton-badge');
            labelModal.innerHTML = '';
            if (badge) labelModal.appendChild(badge);
            labelModal.appendChild(document.createTextNode(' ' + (isStandard ? 'Wybierz kolor standardowy' : 'Kolor RAL (Wymagany)')));
        }

        window.initKasetonRalPickers();
        window.updateKasetonRalPreviews(ral);
    }

    // Sync cable exit options
    const cableExitSelect = document.getElementById('kasetonCableExit');
    const cableDrillValEl = document.getElementById('kasetonCableDrillVal');
    if (cableExitSelect) {
        cableExitSelect.value = config.cableExit || 'back_print';
        if (typeof window.onKasetonCableExitChange === 'function') {
            window.onKasetonCableExitChange(cableExitSelect);
        }
        if (cableDrillValEl && config.cableDrillVal !== undefined) {
            cableDrillValEl.value = config.cableDrillVal;
        }
    }

    // Sync cut options
    const cutEl = document.getElementById('kasetonCut');
    if (cutEl) {
        cutEl.value = config.cut || 'none';
        const sysEl = document.getElementById('kasetonSystem');
        const sys = sysEl ? sysEl.value : '';
        const isCTF = (sys === 'CTF' || sys === 'CTF_LED');

        const btnCustomCut = document.getElementById('btnConfigureCustomCut');
        const btnCTFFrontBack = document.getElementById('btnConfigureCustomCTFFrontBack');
        const btnCTFLeftRight = document.getElementById('btnConfigureCustomCTFLeftRight');
        const btnCTFTopBottom = document.getElementById('btnConfigureCustomCTFTopBottom');

        const showCustom = (cutEl.value === 'custom');

        if (btnCustomCut) {
            btnCustomCut.style.display = (showCustom && !isCTF) ? 'block' : 'none';
        }
        if (btnCTFFrontBack) {
            btnCTFFrontBack.style.display = (showCustom && isCTF) ? 'block' : 'none';
        }
        if (btnCTFLeftRight) {
            btnCTFLeftRight.style.display = (showCustom && isCTF) ? 'block' : 'none';
        }
        if (btnCTFTopBottom) {
            btnCTFTopBottom.style.display = (showCustom && isCTF) ? 'block' : 'none';
        }
    }
};

window.toggleSubmenuUp = function(btn) {
    // Close other submenus first
    document.querySelectorAll('.submenu-up').forEach(menu => {
        if (menu !== btn.nextElementSibling) {
            menu.classList.remove('expanded');
            const trigger = menu.previousElementSibling;
            if (trigger) trigger.classList.remove('active');
        }
    });
    
    const menu = btn.nextElementSibling;
    if (menu) {
        const isExpanded = menu.classList.toggle('expanded');
        btn.classList.toggle('active', isExpanded);
        
        if (isExpanded) {
            // Position fixed submenu right above the button
            const rect = btn.getBoundingClientRect();
            menu.style.left = (rect.left + rect.width / 2) + 'px';
            menu.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
            menu.style.transform = 'translateX(-50%)';
        }
    }
};

window.updateBottomToolbarGroups = function() {
    const techBtn = document.getElementById('groupBtnTechPreview');
    const dimBtn = document.getElementById('btnToggleDimensions');
    const modBtn = document.getElementById('btnModuleList');
    if (techBtn && dimBtn && modBtn) {
        const anyVisible = (dimBtn.style.display !== 'none') || (modBtn.style.display !== 'none');
        techBtn.style.display = anyVisible ? 'inline-block' : 'none';
    }

    const graphicsBtn = document.getElementById('groupBtnGraphicsPanel');
    const reportBtn = document.getElementById('btnWydrukiReport');
    const matchBtn = document.getElementById('btnWydrukiMatch');
    const clearBtn = document.getElementById('btnWydrukiClearStage');
    const importBtn = document.getElementById('btnWydrukiImport');
    const analyzeBtn = document.getElementById('btnWydrukiAnalyze');
    if (graphicsBtn) {
        const anyVisible = 
            (reportBtn && reportBtn.style.display !== 'none') || 
            (matchBtn && matchBtn.style.display !== 'none') || 
            (clearBtn && clearBtn.style.display !== 'none') ||
            (importBtn && importBtn.style.display !== 'none') ||
            (analyzeBtn && analyzeBtn.style.display !== 'none');
        graphicsBtn.style.display = anyVisible ? 'inline-block' : 'none';
    }

    const autorepairBtn = document.getElementById('groupBtnAutorepair');
    const magnetBtn = document.getElementById('btnMagnetPull');
    const cornersBtn = document.getElementById('btnAutoResolveCorners');
    if (autorepairBtn && magnetBtn && cornersBtn) {
        const anyVisible = (magnetBtn.style.display !== 'none') || (cornersBtn.style.display !== 'none');
        autorepairBtn.style.display = anyVisible ? 'inline-block' : 'none';
    }
};

// Hook click outside to close submenus
document.addEventListener('click', function(e) {
    if (!e.target.closest('.group-btn-container')) {
        document.querySelectorAll('.submenu-up').forEach(menu => {
            menu.classList.remove('expanded');
            const trigger = menu.previousElementSibling;
            if (trigger) trigger.classList.remove('active');
        });
    }
});

// Hook scroll and resize to close submenus
const toolbarEl = document.getElementById('bottomToolbar');
if (toolbarEl) {
    toolbarEl.addEventListener('scroll', function() {
        document.querySelectorAll('.submenu-up').forEach(menu => {
            menu.classList.remove('expanded');
            const trigger = menu.previousElementSibling;
            if (trigger) trigger.classList.remove('active');
        });
    });
}
window.addEventListener('resize', function() {
    document.querySelectorAll('.submenu-up').forEach(menu => {
        menu.classList.remove('expanded');
        const trigger = menu.previousElementSibling;
        if (trigger) trigger.classList.remove('active');
    });
});

window.onKasetonCutChange = function(sel) {
    if (!sel) return;
    const val = sel.value;
    const sysEl = document.getElementById('kasetonSystem');
    const sys = sysEl ? sysEl.value : '';
    const isCTF = (sys === 'CTF' || sys === 'CTF_LED');

    const btnCustomCut = document.getElementById('btnConfigureCustomCut');
    const btnCTFFrontBack = document.getElementById('btnConfigureCustomCTFFrontBack');
    const btnCTFLeftRight = document.getElementById('btnConfigureCustomCTFLeftRight');
    const btnCTFTopBottom = document.getElementById('btnConfigureCustomCTFTopBottom');

    const showCustom = (val === 'custom');

    if (btnCustomCut) {
        btnCustomCut.style.display = (showCustom && !isCTF) ? 'block' : 'none';
    }
    if (btnCTFFrontBack) {
        btnCTFFrontBack.style.display = (showCustom && isCTF) ? 'block' : 'none';
    }
    if (btnCTFLeftRight) {
        btnCTFLeftRight.style.display = (showCustom && isCTF) ? 'block' : 'none';
    }
    if (btnCTFTopBottom) {
        btnCTFTopBottom.style.display = (showCustom && isCTF) ? 'block' : 'none';
    }

    if (val === 'custom') {
        if (isCTF) {
            window.openCustomCutModal('frontBack');
        } else {
            window.openCustomCutModal();
        }
    }
};

window.openCustomCutModal = function(planeKey) {
    const widthEl = document.getElementById('kasetonWidth');
    const depthEl = document.getElementById('kasetonDepth');
    const height3DEl = document.getElementById('kasetonHeight3D');
    const sysEl = document.getElementById('kasetonSystem');
    if (!widthEl || !depthEl) return;

    const sys = sysEl ? sysEl.value : '';
    const isCTF = (sys === 'CTF' || sys === 'CTF_LED');

    if (isCTF && !planeKey) {
        planeKey = 'frontBack';
    }

    const W_orig = parseInt(widthEl.value, 10) || 100;
    const H_orig = parseInt(depthEl.value, 10) || 200;
    const D_orig = height3DEl ? (parseInt(height3DEl.value, 10) || 120) : 120;

    let W = W_orig;
    let H = H_orig;
    let planeTitle = "Konfiguracja własnego podziału (Supporty)";
    let labelX = "lewej";
    let labelY = "dołu";

    if (isCTF && planeKey) {
        if (planeKey === 'frontBack') {
            W = W_orig;
            H = H_orig;
            planeTitle = "Konfiguracja: Przód / Tył";
            labelX = "lewej";
            labelY = "dołu";
        } else if (planeKey === 'leftRight') {
            W = D_orig;
            H = H_orig;
            planeTitle = "Konfiguracja: Boki (Lewy / Prawy)";
            labelX = "przodu";
            labelY = "dołu";
        } else if (planeKey === 'topBottom') {
            W = W_orig;
            H = D_orig;
            planeTitle = "Konfiguracja: Góra / Dół";
            labelX = "lewej";
            labelY = "przodu";
        }
    }

    const existing = document.getElementById('custom-cut-modal');
    if (existing) existing.remove();

    if (!window.currentKasetonConfig) {
        window.currentKasetonConfig = {};
    }
    if (!window.currentKasetonConfig.customSupports) {
        if (isCTF) {
            window.currentKasetonConfig.customSupports = {
                frontBack: { vertical: [], horizontal: [] },
                leftRight: { vertical: [], horizontal: [] },
                topBottom: { vertical: [], horizontal: [] }
            };
        } else {
            window.currentKasetonConfig.customSupports = { vertical: [], horizontal: [] };
        }
    }

    // Ensure nesting is present if switched system
    if (isCTF && !window.currentKasetonConfig.customSupports.frontBack) {
        window.currentKasetonConfig.customSupports = {
            frontBack: { vertical: [], horizontal: [] },
            leftRight: { vertical: [], horizontal: [] },
            topBottom: { vertical: [], horizontal: [] }
        };
    } else if (!isCTF && window.currentKasetonConfig.customSupports.frontBack) {
        window.currentKasetonConfig.customSupports = { vertical: [], horizontal: [] };
    }

    if (!window.currentKasetonConfig.customCuts) {
        if (isCTF) {
            window.currentKasetonConfig.customCuts = {
                frontBack: { vertical: [], horizontal: [] },
                leftRight: { vertical: [], horizontal: [] },
                topBottom: { vertical: [], horizontal: [] }
            };
        } else {
            window.currentKasetonConfig.customCuts = { vertical: [], horizontal: [] };
        }
    }

    if (isCTF && !window.currentKasetonConfig.customCuts.frontBack) {
        window.currentKasetonConfig.customCuts = {
            frontBack: { vertical: [], horizontal: [] },
            leftRight: { vertical: [], horizontal: [] },
            topBottom: { vertical: [], horizontal: [] }
        };
    } else if (!isCTF && window.currentKasetonConfig.customCuts.frontBack) {
        window.currentKasetonConfig.customCuts = { vertical: [], horizontal: [] };
    }

    let supportsCopy;
    let cutsCopy;
    if (isCTF && planeKey) {
        supportsCopy = JSON.parse(JSON.stringify(window.currentKasetonConfig.customSupports[planeKey] || { vertical: [], horizontal: [] }));
        cutsCopy = JSON.parse(JSON.stringify(window.currentKasetonConfig.customCuts[planeKey] || { vertical: [], horizontal: [] }));
    } else {
        supportsCopy = JSON.parse(JSON.stringify(window.currentKasetonConfig.customSupports));
        cutsCopy = JSON.parse(JSON.stringify(window.currentKasetonConfig.customCuts || { vertical: [], horizontal: [] }));
    }

    const modal = document.createElement('div');
    modal.id = 'custom-cut-modal';
    modal.className = 'height-modal-overlay';

    const renderModalContent = () => {
        const { collisionsV, collisionsH } = checkCustomSupportsCollisions(supportsCopy.vertical, supportsCopy.horizontal);

        const maxW = 230;
        const maxH = 350;
        const scale = Math.min(maxW / W, maxH / H);
        const pw = W * scale;
        const ph = H * scale;

        let previewHtml = '';

        // Nanieś cięcia (zielone kreski) na podgląd (najpierw, aby były pod supportami)
        cutsCopy.vertical.forEach((vc, idx) => {
            const leftPx = vc.pos * scale;
            previewHtml += `
                <div class="height-preview-acc" style="
                    left: ${leftPx}px;
                    width: 1px;
                    bottom: -15px;
                    height: ${ph + 30}px;
                    border-left: 1px dashed #28a745;
                    z-index: 1;
                " title="Cięcie pionowe: ${vc.pos} cm">
                </div>
            `;
        });

        cutsCopy.horizontal.forEach((hc, idx) => {
            const bottomPx = hc.pos * scale;
            previewHtml += `
                <div class="height-preview-acc" style="
                    left: -15px;
                    width: ${pw + 30}px;
                    bottom: ${bottomPx}px;
                    height: 1px;
                    border-bottom: 1px dashed #28a745;
                    z-index: 1;
                " title="Cięcie poziome: ${hc.pos} cm">
                </div>
            `;
        });

        supportsCopy.vertical.forEach((vs, idx) => {
            const isColliding = collisionsV.has(idx);
            const bgColor = isColliding ? '#ff2a2a' : '#00e5ff';
            const borderColor = isColliding ? '#ff0000' : '#00b2cc';
            const color = isColliding ? '#fff' : '#000';
            
            const leftPx = (vs.pos - 2.5) * scale;
            const widthPx = 5 * scale;
            const heightPx = ph;

            previewHtml += `
                <div class="height-preview-acc" style="
                    left: ${leftPx}px;
                    width: ${widthPx}px;
                    bottom: 0px;
                    height: ${heightPx}px;
                    background: ${bgColor};
                    border: 1px solid ${borderColor};
                    color: ${color};
                    writing-mode: vertical-lr;
                    text-orientation: mixed;
                    text-align: center;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                    font-size: 9px;
                    line-height: 1;
                    padding: 0;
                    margin: 0;
                    box-sizing: border-box;
                    z-index: 5;
                " title="Support pionowy: ${vs.pos} cm">
                    P#${idx + 1}
                </div>
            `;
        });

        supportsCopy.horizontal.forEach((hs, idx) => {
            const isColliding = collisionsH.has(idx);
            const bgColor = isColliding ? '#ff2a2a' : '#ff9900';
            const borderColor = isColliding ? '#ff0000' : '#cc7700';
            const color = isColliding ? '#fff' : '#000';
            
            const bottomPx = (hs.pos - 2.5) * scale;
            const heightPx = 5 * scale;
            const widthPx = pw;

            previewHtml += `
                <div class="height-preview-acc" style="
                    left: 0px;
                    width: ${widthPx}px;
                    bottom: ${bottomPx}px;
                    height: ${heightPx}px;
                    background: ${bgColor};
                    border: 1px solid ${borderColor};
                    color: ${color};
                    text-align: center;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                    font-size: 9px;
                    line-height: 1;
                    padding: 0;
                    margin: 0;
                    box-sizing: border-box;
                    z-index: 5;
                " title="Support poziomy: ${hs.pos} cm">
                    H#${idx + 1}
                </div>
            `;
        });

        let listHtml = '';
        let hasWarning = false;
        
        supportsCopy.vertical.forEach((vs, idx) => {
            const isColliding = collisionsV.has(idx);
            const maxPos = W - 5;
            listHtml += `
                <div class="height-control-row ${isColliding ? 'colliding-row' : ''}">
                    <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:8px; align-items:center;">
                        <span style="color: ${isColliding ? '#ff5555' : '#00e5ff'}; font-size:12px;">
                            ${isColliding ? '⚠️ ' : ''}Support pionowy (#${idx+1})
                        </span>
                        ${isColliding ? '<span style="color:#ff2a2a; font-size:10px; font-weight:bold; text-transform:uppercase;">Kolizja!</span>' : ''}
                    </div>
                    <div style="display:flex; gap:15px; align-items:center;">
                        <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                            <span style="font-size:10px; color:#888;">Odległość od ${labelX} (cm):</span>
                            <input type="range" class="modal-slider v-slider" data-idx="${idx}" min="5" max="${maxPos}" value="${vs.pos}" style="width:100%;">
                        </div>
                        <div style="width:80px; display:flex; flex-direction:column; gap:4px;">
                            <span style="font-size:10px; color:#888;">Wpisz (cm):</span>
                            <input type="number" class="modal-num-input v-input" data-idx="${idx}" min="5" max="${maxPos}" value="${vs.pos}">
                        </div>
                        <button class="btn-delete-support neon-pink" data-type="vertical" data-idx="${idx}" style="margin-top: 12px; height: 30px; width: 45px; border-radius: 4px; border: 1px solid #ff3366; background: rgba(255, 51, 102, 0.1); color: #ff3366; cursor: pointer; font-size: 11px;">Usuń</button>
                    </div>
                </div>
            `;
        });

        supportsCopy.horizontal.forEach((hs, idx) => {
            const isColliding = collisionsH.has(idx);
            const maxPos = H - 5;
            listHtml += `
                <div class="height-control-row ${isColliding ? 'colliding-row' : ''}">
                    <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:8px; align-items:center;">
                        <span style="color: ${isColliding ? '#ff5555' : '#ff9900'}; font-size:12px;">
                            ${isColliding ? '⚠️ ' : ''}Support poziomy (#${idx+1})
                        </span>
                        ${isColliding ? '<span style="color:#ff2a2a; font-size:10px; font-weight:bold; text-transform:uppercase;">Kolizja!</span>' : ''}
                    </div>
                    <div style="display:flex; gap:15px; align-items:center;">
                        <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                            <span style="font-size:10px; color:#888;">Odległość od ${labelY} (cm):</span>
                            <input type="range" class="modal-slider h-slider" data-idx="${idx}" min="5" max="${maxPos}" value="${hs.pos}" style="width:100%;">
                        </div>
                        <div style="width:80px; display:flex; flex-direction:column; gap:4px;">
                            <span style="font-size:10px; color:#888;">Wpisz (cm):</span>
                            <input type="number" class="modal-num-input h-input" data-idx="${idx}" min="5" max="${maxPos}" value="${hs.pos}">
                        </div>
                        <button class="btn-delete-support neon-pink" data-type="horizontal" data-idx="${idx}" style="margin-top: 12px; height: 30px; width: 45px; border-radius: 4px; border: 1px solid #ff3366; background: rgba(255, 51, 102, 0.1); color: #ff3366; cursor: pointer; font-size: 11px;">Usuń</button>
                    </div>
                </div>
            `;
        });

        // Wypisz Cięcia w panelu bocznym z ostrzeżeniami o braku supportu
        cutsCopy.vertical.forEach((vc, idx) => {
            const hasSupport = supportsCopy.vertical.some(vs => Math.abs(vs.pos - vc.pos) < 0.1);
            if (!hasSupport) hasWarning = true;
            const maxPos = W - 5;
            listHtml += `
                <div class="height-control-row ${!hasSupport ? 'colliding-row' : ''}" style="${!hasSupport ? 'border-left: 4px solid #ffaa00; background: rgba(255,170,0,0.03);' : ''}">
                    <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:8px; align-items:center;">
                        <span style="color: ${!hasSupport ? '#ffaa00' : '#ff2a2a'}; font-size:12px;">
                            ${!hasSupport ? '⚠️ ' : ''}Cięcie pionowe (#${idx+1}) ${!hasSupport ? '<span style="font-weight:normal;font-size:10px;color:#ffaa00;">(brak supportu!)</span>' : ''}
                        </span>
                    </div>
                    <div style="display:flex; gap:15px; align-items:center;">
                        <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                            <span style="font-size:10px; color:#888;">Odległość od ${labelX} (cm):</span>
                            <input type="range" class="modal-slider v-cut-slider" data-idx="${idx}" min="5" max="${maxPos}" value="${vc.pos}" style="width:100%;">
                        </div>
                        <div style="width:80px; display:flex; flex-direction:column; gap:4px;">
                            <span style="font-size:10px; color:#888;">Wpisz (cm):</span>
                            <input type="number" class="modal-num-input v-cut-input" data-idx="${idx}" min="5" max="${maxPos}" value="${vc.pos}">
                        </div>
                        <button class="btn-delete-support neon-pink" data-type="vertical-cut" data-idx="${idx}" style="margin-top: 12px; height: 30px; width: 45px; border-radius: 4px; border: 1px solid #ff3366; background: rgba(255, 51, 102, 0.1); color: #ff3366; cursor: pointer; font-size: 11px;">Usuń</button>
                    </div>
                </div>
            `;
        });

        cutsCopy.horizontal.forEach((hc, idx) => {
            const hasSupport = supportsCopy.horizontal.some(hs => Math.abs(hs.pos - hc.pos) < 0.1);
            if (!hasSupport) hasWarning = true;
            const maxPos = H - 5;
            listHtml += `
                <div class="height-control-row ${!hasSupport ? 'colliding-row' : ''}" style="${!hasSupport ? 'border-left: 4px solid #ffaa00; background: rgba(255,170,0,0.03);' : ''}">
                    <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:8px; align-items:center;">
                        <span style="color: ${!hasSupport ? '#ffaa00' : '#ff2a2a'}; font-size:12px;">
                            ${!hasSupport ? '⚠️ ' : ''}Cięcie poziome (#${idx+1}) ${!hasSupport ? '<span style="font-weight:normal;font-size:10px;color:#ffaa00;">(brak supportu!)</span>' : ''}
                        </span>
                    </div>
                    <div style="display:flex; gap:15px; align-items:center;">
                        <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                            <span style="font-size:10px; color:#888;">Odległość od ${labelY} (cm):</span>
                            <input type="range" class="modal-slider h-cut-slider" data-idx="${idx}" min="5" max="${maxPos}" value="${hc.pos}" style="width:100%;">
                        </div>
                        <div style="width:80px; display:flex; flex-direction:column; gap:4px;">
                            <span style="font-size:10px; color:#888;">Wpisz (cm):</span>
                            <input type="number" class="modal-num-input h-cut-input" data-idx="${idx}" min="5" max="${maxPos}" value="${hc.pos}">
                        </div>
                        <button class="btn-delete-support neon-pink" data-type="horizontal-cut" data-idx="${idx}" style="margin-top: 12px; height: 30px; width: 45px; border-radius: 4px; border: 1px solid #ff3366; background: rgba(255, 51, 102, 0.1); color: #ff3366; cursor: pointer; font-size: 11px;">Usuń</button>
                    </div>
                </div>
            `;
        });

        if (supportsCopy.vertical.length === 0 && supportsCopy.horizontal.length === 0 && cutsCopy.vertical.length === 0 && cutsCopy.horizontal.length === 0) {
            listHtml = `<div style="text-align: center; color: #888; margin-top: 50px;">Brak dodanych elementów. Użyj przycisków powyżej aby dodać supporty lub cięcia.</div>`;
        }

        const warningBanner = hasWarning ? `
            <div style="background: rgba(255, 170, 0, 0.15); border: 1px solid #ffaa00; border-radius: 4px; color: #ffaa00; padding: 10px; margin-bottom: 15px; font-size: 11px; font-weight: bold; text-align: center;">
                ⚠️ Każde cięcie profilu obwodowego wymaga dodania supportu na tej samej pozycji w celu wzmocnienia ramy!
            </div>
        ` : '';

        modal.innerHTML = `
            <div class="height-modal-container" onclick="event.stopPropagation();" style="width: 900px; height: 660px;">
                <div class="height-modal-header">
                    <h2>${planeTitle}</h2>
                    <span class="height-modal-close" id="modalCloseBtn">✕</span>
                </div>
                <div class="height-modal-body" style="height: 580px;">
                    <div class="height-modal-preview-col" style="justify-content: center;">
                        <h4 style="margin: 0 0 15px 0; color: #888; text-align: center;">Podgląd Modułu (2D)</h4>
                        <div style="display:flex; flex-direction:column; align-items:center; justify-content: center; height: 370px;">
                            <div class="height-preview-module-wrapper" style="overflow: visible;">
                                <div class="height-preview-module" style="width: ${pw}px; height: ${ph}px; border: 2px solid #00e5ff; background: rgba(0, 229, 255, 0.02); display: block; position: relative; overflow: visible;">
                                    ${previewHtml}
                                </div>
                            </div>
                            <span style="font-size:11px; color:#aaa; font-weight:bold; margin-top:10px;">${W} x ${H} cm</span>
                        </div>
                    </div>
                    <div class="height-modal-controls-col" style="display: flex; flex-direction: column;">
                        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: space-between;">
                            <button id="btnAddVerticalSupport" class="btn-bottom neon-cyan" style="flex: 1; padding: 8px; font-size: 10px; height: auto; white-space: nowrap;">➕ Dodaj support pionowy</button>
                            <button id="btnAddHorizontalSupport" class="btn-bottom neon-orange" style="flex: 1; padding: 8px; font-size: 10px; height: auto; white-space: nowrap;">➕ Dodaj support poziomy</button>
                        </div>
                        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: space-between;">
                            <button id="btnAddVerticalCut" class="btn-bottom" style="flex: 1; padding: 8px; font-size: 10px; height: auto; white-space: nowrap; border: 1px solid #ff3366; background: rgba(255, 51, 102, 0.1); color: #ff3366;">➕ Dodaj cięcie pionowe</button>
                            <button id="btnAddHorizontalCut" class="btn-bottom" style="flex: 1; padding: 8px; font-size: 10px; height: auto; white-space: nowrap; border: 1px solid #ff3366; background: rgba(255, 51, 102, 0.1); color: #ff3366;">➕ Dodaj cięcie poziome</button>
                        </div>
                        <button id="btnAutoMatchSupports" class="btn-bottom neon-green" style="width: 100%; margin-bottom: 10px; padding: 8px; font-size: 10px; height: auto; font-weight: bold; background: rgba(0, 230, 115, 0.1); border: 1px solid #00e673; color: #00e673;">⚡ Wstaw supporty automatycznie</button>
                        ${warningBanner}
                        <div class="height-modal-scrollable-controls" style="flex: 1; min-height: 200px;">
                            ${listHtml}
                        </div>
                        <div class="height-modal-footer" style="margin-top: 10px;">
                            <button id="modalCancelBtn" class="btn-bottom neon-pink">Anuluj</button>
                            <button id="modalSaveBtn" class="btn-bottom neon-green">Zapisz</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.querySelector('#modalCloseBtn').onclick = () => modal.remove();
        modal.querySelector('#modalCancelBtn').onclick = () => modal.remove();
        
        modal.querySelector('#modalSaveBtn').onclick = () => {
            if (isCTF && planeKey) {
                window.currentKasetonConfig.customSupports[planeKey] = supportsCopy;
                window.currentKasetonConfig.customCuts[planeKey] = cutsCopy;
                const cs = window.currentKasetonConfig.customSupports;
                const lenFBV = (cs.frontBack?.vertical?.length || 0) * (H_orig - 4.2426) * 2;
                const lenFBH = (cs.frontBack?.horizontal?.length || 0) * (W_orig - 4.2426) * 2;
                const lenLRV = (cs.leftRight?.vertical?.length || 0) * (H_orig - 4.2426) * 2;
                const lenLRH = (cs.leftRight?.horizontal?.length || 0) * (D_orig - 4.2426) * 2;
                const lenTBV = (cs.topBottom?.vertical?.length || 0) * (W_orig - 4.2426) * 2;
                const lenTBH = (cs.topBottom?.horizontal?.length || 0) * (D_orig - 4.2426) * 2;

                window.currentKasetonConfig.totalSupportLengthM = (lenFBV + lenFBH + lenLRV + lenLRH + lenTBV + lenTBH) / 100;
                window.currentKasetonConfig.supportSegmentsCount = 
                    ((cs.frontBack?.vertical?.length || 0) + (cs.frontBack?.horizontal?.length || 0)) * 2 +
                    ((cs.leftRight?.vertical?.length || 0) + (cs.leftRight?.horizontal?.length || 0)) * 2 +
                    ((cs.topBottom?.vertical?.length || 0) + (cs.topBottom?.horizontal?.length || 0)) * 2;
            } else {
                window.currentKasetonConfig.customSupports = supportsCopy;
                window.currentKasetonConfig.customCuts = cutsCopy;
                const vLen = supportsCopy.vertical.length;
                const hLen = supportsCopy.horizontal.length;
                window.currentKasetonConfig.totalSupportLengthM = ((vLen * (H - 5.4) + hLen * (W - 5.4)) / 100);
                window.currentKasetonConfig.supportSegmentsCount = vLen + hLen * (vLen + 1);
            }

            modal.remove();

            if (typeof is3DMode !== 'undefined' && is3DMode) {
                if (typeof update3DScene === 'function') update3DScene();
            } else {
                if (typeof render === 'function') render();
            }
        };

        modal.querySelector('#btnAddVerticalSupport').onclick = () => {
            const defaultPos = Math.round(W / 2);
            const clamped = Math.max(5, Math.min(W - 5, defaultPos));
            supportsCopy.vertical.push({ pos: clamped });
            renderModalContent();
        };

        modal.querySelector('#btnAddHorizontalSupport').onclick = () => {
            const defaultPos = Math.round(H / 2);
            const clamped = Math.max(5, Math.min(H - 5, defaultPos));
            supportsCopy.horizontal.push({ pos: clamped });
            renderModalContent();
        };

        modal.querySelector('#btnAddVerticalCut').onclick = () => {
            const defaultPos = Math.round(W / 2);
            const clamped = Math.max(5, Math.min(W - 5, defaultPos));
            cutsCopy.vertical.push({ pos: clamped });
            renderModalContent();
        };

        modal.querySelector('#btnAddHorizontalCut').onclick = () => {
            const defaultPos = Math.round(H / 2);
            const clamped = Math.max(5, Math.min(H - 5, defaultPos));
            cutsCopy.horizontal.push({ pos: clamped });
            renderModalContent();
        };

        modal.querySelector('#btnAutoMatchSupports').onclick = () => {
            supportsCopy.vertical = [];
            supportsCopy.horizontal = [];
            cutsCopy.vertical.forEach(vc => {
                supportsCopy.vertical.push({ pos: vc.pos });
            });
            cutsCopy.horizontal.forEach(hc => {
                supportsCopy.horizontal.push({ pos: hc.pos });
            });
            renderModalContent();
        };

        modal.querySelectorAll('.btn-delete-support').forEach(btn => {
            btn.onclick = (e) => {
                const type = e.target.dataset.type;
                const idx = parseInt(e.target.dataset.idx, 10);
                if (type === 'vertical') {
                    supportsCopy.vertical.splice(idx, 1);
                } else if (type === 'horizontal') {
                    supportsCopy.horizontal.splice(idx, 1);
                } else if (type === 'vertical-cut') {
                    cutsCopy.vertical.splice(idx, 1);
                } else if (type === 'horizontal-cut') {
                    cutsCopy.horizontal.splice(idx, 1);
                }
                renderModalContent();
            };
        });

        modal.querySelectorAll('.v-slider').forEach(slider => {
            slider.oninput = (e) => {
                const idx = parseInt(e.target.dataset.idx, 10);
                const val = parseInt(e.target.value, 10);
                supportsCopy.vertical[idx].pos = val;
                const row = e.target.closest('.height-control-row');
                if (row) {
                    const numInput = row.querySelector('.v-input');
                    if (numInput) numInput.value = val;
                }
                renderModalContent();
            };
        });

        modal.querySelectorAll('.h-slider').forEach(slider => {
            slider.oninput = (e) => {
                const idx = parseInt(e.target.dataset.idx, 10);
                const val = parseInt(e.target.value, 10);
                supportsCopy.horizontal[idx].pos = val;
                const row = e.target.closest('.height-control-row');
                if (row) {
                    const numInput = row.querySelector('.h-input');
                    if (numInput) numInput.value = val;
                }
                renderModalContent();
            };
        });

        modal.querySelectorAll('.v-cut-slider').forEach(slider => {
            slider.oninput = (e) => {
                const idx = parseInt(e.target.dataset.idx, 10);
                const val = parseInt(e.target.value, 10);
                cutsCopy.vertical[idx].pos = val;
                const row = e.target.closest('.height-control-row');
                if (row) {
                    const numInput = row.querySelector('.v-cut-input');
                    if (numInput) numInput.value = val;
                }
                renderModalContent();
            };
        });

        modal.querySelectorAll('.h-cut-slider').forEach(slider => {
            slider.oninput = (e) => {
                const idx = parseInt(e.target.dataset.idx, 10);
                const val = parseInt(e.target.value, 10);
                cutsCopy.horizontal[idx].pos = val;
                const row = e.target.closest('.height-control-row');
                if (row) {
                    const numInput = row.querySelector('.h-cut-input');
                    if (numInput) numInput.value = val;
                }
                renderModalContent();
            };
        });

        modal.querySelectorAll('.v-input').forEach(input => {
            input.onchange = (e) => {
                const idx = parseInt(e.target.dataset.idx, 10);
                let val = parseInt(e.target.value, 10);
                const maxPos = W - 5;
                if (isNaN(val) || val < 5) val = 5;
                if (val > maxPos) val = maxPos;
                supportsCopy.vertical[idx].pos = val;
                renderModalContent();
            };
        });

        modal.querySelectorAll('.h-input').forEach(input => {
            input.onchange = (e) => {
                const idx = parseInt(e.target.dataset.idx, 10);
                let val = parseInt(e.target.value, 10);
                const maxPos = H - 5;
                if (isNaN(val) || val < 5) val = 5;
                if (val > maxPos) val = maxPos;
                supportsCopy.horizontal[idx].pos = val;
                renderModalContent();
            };
        });

        modal.querySelectorAll('.v-cut-input').forEach(input => {
            input.onchange = (e) => {
                const idx = parseInt(e.target.dataset.idx, 10);
                let val = parseInt(e.target.value, 10);
                const maxPos = W - 5;
                if (isNaN(val) || val < 5) val = 5;
                if (val > maxPos) val = maxPos;
                cutsCopy.vertical[idx].pos = val;
                renderModalContent();
            };
        });

        modal.querySelectorAll('.h-cut-input').forEach(input => {
            input.onchange = (e) => {
                const idx = parseInt(e.target.dataset.idx, 10);
                let val = parseInt(e.target.value, 10);
                const maxPos = H - 5;
                if (isNaN(val) || val < 5) val = 5;
                if (val > maxPos) val = maxPos;
                cutsCopy.horizontal[idx].pos = val;
                renderModalContent();
            };
        });
    };

    document.body.appendChild(modal);
    renderModalContent();
};

function checkCustomSupportsCollisions(verticalList, horizontalList) {
    const collisionsV = new Set();
    const collisionsH = new Set();
    
    for (let i = 0; i < verticalList.length; i++) {
        for (let j = i + 1; j < verticalList.length; j++) {
            if (Math.abs(verticalList[i].pos - verticalList[j].pos) < 5) {
                collisionsV.add(i);
                collisionsV.add(j);
            }
        }
    }
    
    for (let i = 0; i < horizontalList.length; i++) {
        for (let j = i + 1; j < horizontalList.length; j++) {
            if (Math.abs(horizontalList[i].pos - horizontalList[j].pos) < 5) {
                collisionsH.add(i);
                collisionsH.add(j);
            }
        }
    }
    
    return { collisionsV, collisionsH };
}
