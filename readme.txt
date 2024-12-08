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

Struktrua apps/xkocit00:

Struktrua apps/xluklp00:

Backend:
- Backend je koncipován jako node balíček obsahující třídy ItemManagerBase, ListManagerBase,
ResourceManagerBase a UserManagerBase. Tyto třídy jsou rozhraním k firebase, kde jsou data uložena.
Tento balíček je nainstalován do jednotlivých FE a jednotlivé FE implementace používají tyto třídy.