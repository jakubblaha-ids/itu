Jednotlivé webové aplikace:

Každý člen týmu zpracoval vlastní verzi designu a vlastní frontend.
Každý jednotlivý FE je uložen v následujících adresářích:

- apps/xblaha36
- apps/xcalko00
- apps/xkocit00
- apps/xluklp00

Struktrua apps/xblaha36:

src
├── icons   --------------------- ikony, každá je uložena jako svelte component
├── lib
│   ├── components  ------------- znovupoužitelné komponenty. Obsahuje navigave, menu, tlačítka, seznam věcí, inputy
│   ├── modals  ----------------- modální okna
│   └── partials    ------------- větší kusy UI, větší logické UI celky
├── routes  --------------------- 
│   ├── +page.svelte  ----------- hlavní stránka
│   ├── +layout.svelte  --------- nastavení firebase, barvičky
│   └── import-list
│       └── +page.svelte    ----- route pro importování shared seznamu
└── ts  ------------------------- obsahuje jednotlivé poděděné managery z backendu, které napojují
                                  jejich funkcionalitu na svelte stores

Struktrua apps/xcalko00:
src
├── views  ---------------------- stranky
│   ├── ListsView.vue 
│   ├── ListView.vue
│   └── AddItemView.vue
├── components ------------------ komponenty vyuziváne v aplikace
├── managers -------------------- implementace manageru rozsirujicich tridy z backendu
├── router 
│   └── index.ts ---------------- vue router vyuzivany pro navigaci v aplikace, definice stranek a jejich komponent
├── App.vue --------------------- hlavni aplikace, ktera zobrazuje RouterView 
├── main.ts --------------------- inicializace aplikace, nastaveni firebase databaze, 

Struktrua apps/xkocit00:
├── src
│   ├── app ----------------------------------- angular root adresář, základní modul, definice navigace
│   │   ├── components  ----------------------- použité UI komponenty
│   │   ├── services    ----------------------- angular služby pro práci s daty
│   │   ├── directives  ----------------------- jediná použitá custom directive(zabaleno do adresáře pouze pro clean code)

Struktrua apps/xluklp00:
├── lib                                 
│   ├── components                      svelte komponenty využívané v aplikaci
│   │   ├── AddItemDrawer.svelte 
│   │   ├── CodeInput.svelte
│   │   ├── DataReload.svelte
│   │   ├── ItemCard.svelte
│   │   ├── ListCard.svelte
│   │   ├── Loader.svelte
│   │   ├── Navbar.svelte
│   │   ├── StringListItem.svelte
│   │   ├── UnitAmountInput.svelte
│   │   └── modals                      modální okna a podobné svelte komponenty ve vlastní složce
│   │       ├── ImportModal.svelte
│   │       ├── MenuModal.svelte
│   │       ├── Modal.svelte
│   │       ├── ModalRenderer.svelte
│   │       └── UserModal.svelte
│   ├── icons                           ikony jako svelte komponenty využívané v aplikaci
│   └── script                          složka obsahující všechny typescript soubory pro oddělení definic od GUI
│       ├── ItemManager.ts              obsahuje třídu ItemManager, která dědí z ItemManagerBase
│       ├── ListManager.ts              obsahuje třídu ListManager, která dědí z ListManagerBase
│       ├── UserManager.ts              obsahuje třídu UserManager, která dědí z UserManagerBase
│       ├── drawer.ts                   obsahuje definice typů pro přidávání položek do seznamu
│       ├── index.ts                    obsahuje inicializaci firebase a BE manager tříd
│       ├── listSort.ts                 obsahuje definice typů a konstant pro řazení seznamů
│       └── modal.ts                    obsahuje definice typů, svelte storů a record pro funkčnost modálních oken a podobných částí aplikace
└── routes                              složka definující strukturu stránek aplikace
    ├── +layout.svelte                  základní wrapper pro všechny stránky aplikace
    ├── +page.svelte                    hlavní stránka, pouze routuje na jiné
    └── lists                           
        ├── +page.svelte                stránka /lists zobrazující seznamy uživatele
        └── [list]                      dynamická stránka /lists/[list] zobrazující jednotlivý seznam
            ├── +page.server.ts         kód který běží na serveru při přístupu na stránku, dodává data o seznamu GUI
            └── +page.svelte            přebírá data o seznamu a zobrazuje seznam

Backend:
- Backend je koncipován jako node balíček obsahující třídy ItemManagerBase, ListManagerBase,
ResourceManagerBase a UserManagerBase. Tyto třídy jsou rozhraním k firebase, kde jsou data uložena.
Tento balíček je nainstalován do jednotlivých FE a jednotlivé FE implementace používají tyto třídy.

Zdrojové soubory pro backend jsou v packages/backend/src.
