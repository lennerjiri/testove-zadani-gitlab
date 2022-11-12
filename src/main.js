import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// reset
import "./assets/styles/reset.scss";

// Icons
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faList,
  faArrowsRotate,
  faUserGroup,
  faLayerGroup,
} from "@fortawesome/pro-regular-svg-icons";

/* add icons to the library */
library.add(faList, faArrowsRotate, faUserGroup, faLayerGroup);

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.use(router);

app.mount("#app");
