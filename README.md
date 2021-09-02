# Vikingské války
Toto je jednoduchá JavaScriptová aplikace, kterou jsme využívali pro urychlení vyhodnocení plenění a lovu v táborové hře "Vikingské války". Podrobnosti ke hře jsou zveřejněny na stránkách hranostaj.cz, nebo [Vikingske_valky]. Podrobnější manuál k aplikaci bohužel zatím chybí. Pokud by jste potřebovali poradit s použitím, tak mě kontaktujte.

## Instalace a spuštění

Pro spuštění aplikace je nutné mít instalováno [node.js]. Po úspěšné instalaci node.js otevřete příkazovou řádku (např. v menu start napište `cmd`) se přesuňte do adresáře, kde chcete mít umístěnou aplikaci (např. napiště `cd desktop`). Pak proveďte tyto příkazy:

```sh
git clone https://github.com/RadimBaca/Vikingske_valky
cd Vikingske_valky
npm install
npm run start
```

V případě zájmu o spustitelný soubor (kupříkladu exe soubor pro windows) napište na email rad.baca@gmail.com.

## Aplikace

Aplikace je nyní navržena na tři týmy. V JSON souborech jsou nyní uloženy nějaké postavy, které můžete přejmenovat a přidat nové (panel "Players"). Vyhodnocení nové sezóny se provádí v panelu "Seasons". Všechny údaje v aplikaci se ukládaji pro jednoduchost do JSON souborů.


[node.js]: <http://nodejs.org>
[Vikingske_valky]: <https://docs.google.com/document/d/1b9AThWP3h9tVdmllAJ6mhCp97xHbVmWlqpIug5AFMhs/edit?usp=sharing>
