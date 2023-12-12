# uniswap-ts

to run:

```bash
npm i
npm run start
```

Este programa utiliza la librería de @bella-defintech/uniswap-v3-simulator , una copia de univ3 en typescript.

Este programa toma en pool_number y swap_number los valores correspondientes para ejecutar el swap en el pool deseado.
Se inicia el pool, se mintea, y se imprimen algunos valores relevantes.


La idea sería ejecutar el swap() con un debugger para comparar paso a paso los valores de las variables.

Al mismo tiempo, deberíamos hacer una branch de nuestro Cairo, el cual imprima los valores de las variables, para poder comparar en dónde hay una discrepancia
