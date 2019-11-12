/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/atom-one-light.css';

import Container from './helper/container.vue';
import Card from './helper/card.vue';
import Basic from './demo/Basic.vue';
import ValueType from './demo/ValueType.vue';
import Range from './demo/Range.vue';
import DisabledDateTime from './demo/DisabledDateTime.vue';
import Shortcut from './demo/Shortcut.vue';
import ControlTimePanel from './demo/ControlTimePanel.vue';
import ControlOpen from './demo/ControlOpen.vue';
import HideSeconds from './demo/HideSeconds.vue';
import MinuteStep from './demo/MinuteStep.vue';
import FixedTimeList from './demo/FixedTimeList.vue';
import Disabled from './demo/Disabled.vue';

import en from './en.md';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

const components = [
  {
    id: 'Basic',
    component: Basic,
    code: fs.readFileSync(`${__dirname}/demo/Basic.vue`, 'utf8'),
  },
  {
    id: 'ValueType',
    component: ValueType,
    code: fs.readFileSync(`${__dirname}/demo/ValueType.vue`, 'utf8'),
  },
  {
    id: 'Range',
    component: Range,
    code: fs.readFileSync(`${__dirname}/demo/Range.vue`, 'utf8'),
  },
  {
    id: 'HideSeconds',
    component: HideSeconds,
    code: fs.readFileSync(`${__dirname}/demo/HideSeconds.vue`, 'utf8'),
  },
  {
    id: 'MinuteStep',
    component: MinuteStep,
    code: fs.readFileSync(`${__dirname}/demo/MinuteStep.vue`, 'utf8'),
  },
  {
    id: 'FixedTimeList',
    component: FixedTimeList,
    code: fs.readFileSync(`${__dirname}/demo/FixedTimeList.vue`, 'utf8'),
  },
  {
    id: 'DisabledDateTime',
    component: DisabledDateTime,
    code: fs.readFileSync(`${__dirname}/demo/DisabledDateTime.vue`, 'utf8'),
  },
  {
    id: 'Disabled',
    component: Disabled,
    code: fs.readFileSync(`${__dirname}/demo/Disabled.vue`, 'utf8'),
  },
  {
    id: 'Shortcut',
    component: Shortcut,
    code: fs.readFileSync(`${__dirname}/demo/Shortcut.vue`, 'utf8'),
  },
  {
    id: 'ControlTimePanel',
    component: ControlTimePanel,
    code: fs.readFileSync(`${__dirname}/demo/ControlTimePanel.vue`, 'utf8'),
  },
  {
    id: 'ControlOpen',
    component: ControlOpen,
    code: fs.readFileSync(`${__dirname}/demo/ControlOpen.vue`, 'utf8'),
  },
];

function transformMd(text) {
  const array = text.split(/\n(?=<!-)/);
  const getId = s => {
    const result = s.match(/<!--\s*(\w+)\s*-->/);
    return result && result[1].trim();
  };
  const getTitleAndDescription = s => {
    const result = s.match(/<h.*?>(.*?)<\/h\d>/);
    if (!result) return null;
    const title = result[1];
    const description = s.slice(result[0].length + result.index);
    return {
      title: title.trim().replace(/&amp;/g, '&'),
      description: description.trim(),
    };
  };
  const result = {};
  array.forEach(str => {
    const id = getId(str);
    if (id) {
      result[id] = getTitleAndDescription(str);
    }
  });
  return result;
}

const titleAndDescMap = transformMd(en);

const App = {
  name: 'App',
  data() {
    return {
      currentId: this.getCurrentId(),
    };
  },
  mounted() {
    hljs.initHighlighting();
    window.onhashchange = () => {
      this.currentId = this.getCurrentId();
    };
    if (this.currentId) {
      document.getElementById(this.currentId).scrollIntoView();
    }
  },
  methods: {
    getCurrentId() {
      return location.hash.slice(1);
    },
  },
  render(h) {
    const menus = components.map(item => {
      return {
        id: item.id,
        ...titleAndDescMap[item.id],
      };
    });
    return (
      <Container menus={menus}>
        {components.map(item => {
          const { component, id, code } = item;
          const props = {
            id,
            code,
            active: id === this.currentId,
            ...titleAndDescMap[id],
          };
          return <Card {...{ props }}>{h(component)}</Card>;
        })}
      </Container>
    );
  },
};

export default App;
