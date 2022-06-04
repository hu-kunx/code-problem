// @ts-ignore
import { render, h, useState } from "./lib/bundle.esm.js";
function ShowValue(props) {
    return (h("span", null, props.value));
}
function App() {
    const [count, setCount] = useState(0);
    return (h("div", null,
        h(ShowValue, { value: count }),
        h("button", { onClick: () => setCount(count + 1) }, "add")));
}
const a = render(App, document.body);
console.log(a);
