import fs from 'fs';
import postcss from 'postcss';

const cssPath = 'app/globals.css';
const jsonPath = 'lib/theme.json'; // Onde o resultado será salvo

console.log('Lendo CSS e gerando JSON de tema...');

try {
  // 1. Ler o arquivo CSS
  const css = fs.readFileSync(cssPath, 'utf8');

  // 2. Parsear o CSS
  const root = postcss.parse(css);

  const themes = {
    dark: {},
    light: {},
  };

  // 3. Iterar sobre as "regras" (ex: [data-theme='dark'])
  root.walkRules((rule) => {
    let themeName = null;

    // Identifica qual tema é
    if (rule.selector === "[data-theme='dark']") {
      themeName = 'dark';
    } else if (rule.selector === "[data-theme='light']") {
      themeName = 'light';
    }

    if (themeName) {
      // 4. Itera sobre as "declarações" (as variáveis) dentro da regra
      rule.walkDecls((decl) => {
        if (decl.prop.startsWith('--')) {
          // Adiciona ao objeto: ex: themes['dark']['--color-background'] = '#080808'
          themes[themeName][decl.prop] = decl.value;
        }
      });
    }
  });

  // 5. Escrever o arquivo JSON
  fs.writeFileSync(jsonPath, JSON.stringify(themes, null, 2));

  console.log(`✅ JSON do tema salvo com sucesso em: ${jsonPath}`);
} catch (error) {
  console.error('Falha ao construir o JSON do tema:', error);
}
