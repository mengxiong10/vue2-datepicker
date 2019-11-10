const path = require('path');
const fs = require('fs');

const libLocales = path.resolve(__dirname, '../../node_modules/date-format-parse/lib/locale');

const localLocalePath = path.resolve(__dirname, '../../src/locale');

const yearBeforeMonth = ['hu', 'ja', 'ko', 'lv', 'vi', 'zh-cn', 'zh-tw'];

const yearFormatMap = {
  'zh-cn': 'YYYY年',
  'zh-tw': 'YYYY年',
};

const getTemplate = locale => {
  const formatLocale = locale.replace(/-(\w+)/, (m, p1) => p1.toLocaleUpperCase());
  const yearFormat = yearFormatMap[locale] || 'YYYY';

  const template = `
${locale === 'en' ? '' : "import DatePicker from 'vue2-datepicker';"}
import ${formatLocale} from 'date-format-parse/lib/locale/${locale}';

const lang = {
  formatLocale: ${formatLocale},
  yearFormat: '${yearFormat}',
  monthFormat: 'MMM',
  monthBeforeYear: ${yearBeforeMonth.indexOf(locale) === -1},
};

${locale === 'en' ? '' : `DatePicker.locale('${locale}', lang);`}

export default lang;
  `;
  return template.trim();
};

function generateLocales() {
  fs.readdirSync(libLocales).forEach(filename => {
    if (!/\.js$/.test(filename)) {
      return;
    }
    const name = filename.replace(/\.js$/, '');
    const data = getTemplate(name);
    fs.writeFile(path.join(localLocalePath, filename), data, err => {
      if (err) {
        throw err;
      }
    });
  });
}

generateLocales();
