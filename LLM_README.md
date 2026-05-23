# Przewodnik po Architekturze i Kodzie Aplikacji (Kaseton Configurator)

Niniejszy dokument stanowi instrukcję techniczną dla modeli LLM (oraz programistów), opisującą strukturę plików, role poszczególnych modułów, konwencje układu współrzędnych 3D oraz zasady generowania zestawienia materiałowego (BOM). Przeczytaj ten plik przed przystąpieniem do modyfikacji kodu, aby uniknąć analizowania całego repozytorium.

---

## 1. Struktura Plików i Role Modułów

Projekt jest aplikacją typu Single Page Application (SPA) opartą na technologiach HTML5, Vanilla CSS oraz JavaScript z biblioteką **Three.js** do wizualizacji 3D.

```
📁 [root]
├── 📄 index.html              # Główny widok HTML, modale konfiguracyjne i struktura UI
├── 📄 LLM_README.md           # Ten plik (przewodnik architektoniczny dla AI)
├── 📁 css/
│   └── 📄 index.css           # System stylizacji (dark mode, layouty, typografia)
└── 📁 js/
    ├── 📄 data.js             # Baza danych: ceny, wagi, systemy LED, mapy neonów
    ├── 📄 3d-engine.js        # Inicjalizacja Three.js (kamera, światła, pętla renderująca)
    ├── 📄 3d-builder.js       # Silnik generowania geometrii 3D (profile, ledy, supporty)
    ├── 📄 ui.js               # Obsługa zdarzeń UI, walidacja i dynamiczne formularze
    ├── 📄 bom.js              # Obliczenia kosztorysu i zestawienia materiałów (BOM)
    └── 📄 export.js           # Obsługa eksportu konfiguracji i rysunków technicznych
```

---

## 2. Podział Odpowiedzialności i Przepływ Danych

```
 index.html ---> (Interakcja użytkownika) ---> ui.js
                                               |
  3d-engine.js <--- (Trójwymiarowe siatki) <--- 3d-builder.js <--- (Dane) <--- data.js
                                               |
                                               v
                                            bom.js (Obliczenia kosztorysu/BOM)
```

### Szczegółowy opis plików:
*   **`index.html`**: Zawiera interfejs użytkownika. Najważniejszym elementem jest formularz modalny konfiguratora kasetonów, w którym użytkownik definiuje parametry (system, szerokość, wysokość, opcje cięcia, podświetlenia i wydruku).
*   **`js/data.js`**: Rejestruje stałe konfiguracyjne aplikacji, m.in. `KASETON_PRICES` (ceny za metr profili, złączki, akcesoria), `KASETON_LED_SYSTEMS` (parametry poboru mocy i gęstości LED) oraz wagi profili.
*   **`js/ui.js`**: Synchronizuje formularze. Odpowiada za dynamiczne dostosowanie opcji w zależności od wybranego systemu (np. ukrywanie/pokazywanie określonych rodzajów wydruków dla LMS vs LMD przy użyciu funkcji `onKasetonSystemChange`).
*   **`js/3d-builder.js`**: Pobiera parametry z globalnego obiektu `window.currentKasetonConfig` i generuje pełną scenę 3D. Tworzy ramy z profili, stopy, zawieszenia, paski LED, złączki oraz płaszczyzny z grafiką reklamową.
*   **`js/bom.js`**: Wykonuje algorytmy zliczania zapotrzebowania na materiały i wylicza ceny końcowe. Agreguje m.in. długości profili (z uwzględnieniem naddatku na cięcia), liczbę złączek prostych 180°, narożników, zasilaczy i stóp.

---

## 3. Konwencje Geometrii 3D (`3d-builder.js`)

Aby zachować spójność wizualną na stykach 45 stopni (mitered corners), wszystkie segmenty ramy profilu muszą być generowane przy użyciu dedykowanych funkcji budujących bufory wierzchołków.

### Układ Współrzędnych i Orientacja Profili
*   Środek kasetonu znajduje się w punkcie `(0, elevY + H/2, 0)`, gdzie `elevY` to wysokość montażu na podłodze (np. 100 cm dla wersji podwieszanej).
*   **Oś Z** reprezentuje głębokość kasetonu:
    *   **LMD** (głębokość 140 mm): Profile rozciągają się od $Z = -7.0$ do $Z = +7.0$.
    *   **LMS** (głębokość 120 mm): Profile rozciągają się od $Z = -6.0$ do $Z = +6.0$.
*   **Oś Y** (w lokalnym układzie profilu):
    *   $Y = 0$: Zewnętrzny obwód ramy (gładka powierzchnia).
    *   $Y > 0$: Wnętrze ramy (kierunek do środka kasetonu, maks. wysokość profilu to $4.5\text{ cm}$).

### Kluczowe funkcje geometryczne:
1.  `createMiteredSegmentGeometry(L, zMin, zMax, t)`: Generuje prostopadłościenny segment o długości `L`, w zakresie głębokości `[zMin, zMax]` i wysokości `t`, ścięty pod kątem 45 stopni na obu końcach.
2.  `createMiteredSlopedGeometry(L, zMin, zMax, yStart, yEnd)`: Generuje skośny segment (np. przejście beveled/skos 135° dla LMS), gdzie wysokość na początku segmentu (`zMin`) wynosi `yStart`, a na końcu (`zMax`) wynosi `yEnd`, również zachowując płaskie, 45-stopniowe cięcie na rogach.

### Różnice w przekroju profili (LMD vs LMS)

| Cecha | Profil LMD (Symetryczny) | Profil LMS (Asymetryczny) |
| :--- | :--- | :--- |
| **Głębokość (Z)** | $14\text{ cm}$ (od $-7.0$ do $+7.0$) | $12\text{ cm}$ (od $-6.0$ do $+6.0$) |
| **Profil skosu** | Brak (profil symetryczny, prostokątny) | Jednolity skos 135° (45° ukośnie) od $Z = -2.0, Y = 4.5$ do $Z = 2.1, Y = 0.4$ |
| **Punkt LED/Support** | Centrowany na osi $Z = 0$ | Przesunięty: **25 mm od tylnej krawędzi** ($Z = -3.5$) |
| **Łączniki 180°** | Zewnętrzne rowki, po 2 szt. na łączenie ($Z = \pm 5.4$) | Wewnętrzna komora, 1 szt. na łączenie ($Z = -5.5$, szerokość $0.8\text{ cm}$) |
| **Narożniki 3D** | Renderowane w rowkach ($Z = \pm 5.4$) | Wyłączone w wizualizacji 3D |

---

## 4. Logika Zestawienia Materiałowego (BOM) (`bom.js`)

Algorytm w `bom.js` przetwarza parametry wejściowe, aby obliczyć zapotrzebowanie produkcyjne:

*   **Długość profili**: Sumuje obwód kasetonu ($2W + 2H$). W przypadku podziałów (cięcia ramy na segmenty ze względu na logistykę), sumowane są fizyczne długości wszystkich dociętych części z uwzględnieniem naddatków.
*   **Łączniki 180°**:
    *   Cięcia pionowe (dzielące szerokość $W$) generują łączniki w profilu dolnym i górnym.
    *   Cięcia poziome (dzielące wysokość $H$) generują łączniki w profilu lewym i prawym.
    *   Dla **LMD**: Liczba cięć $\times 2$ profile $\times 2$ łączniki (przód + tył) = $4 \times \text{liczba cięć}$.
    *   Dla **LMS**: Liczba cięć $\times 2$ profile $\times 1$ łącznik (tylko tył) = $2 \times \text{liczba cięć}$.
*   **Wydruki i Plecy**:
    *   LMD: Wybór opcji dwustronnych (np. backlit przód + blockout tył).
    *   LMS: Ograniczone do jednostronnych opcji (przód backlit, tył jako białe plecy pcv/tkanina lub blockout, bądź brak wydruku).

---

## 5. Jak rozszerzać aplikację

### Dodanie nowego systemu profili (np. LMX):
1.  W `js/data.js` dodaj wpis ceny i parametrów wagi dla nowego profilu.
2.  W `js/ui.js` zaimplementuj reguły widoczności pól wydruku w `onKasetonSystemChange`.
3.  W `js/3d-builder.js`:
    *   Zdefiniuj funkcję `createProfileGroupLMX(L)` analogicznie do LMS/LMD.
    *   Dodaj odnośnik w głównym dyspozytorze `createProfileGroup(L)`.
    *   Skoryguj wartości pozycjonowania LED (`ledZ`, `ledY`), supportów oraz tkanin na podstawie głębokości nowego systemu.
4.  W `js/bom.js` zaimplementuj zasady zliczania akcesoriów (łączniki, narożniki) dla LMX.
