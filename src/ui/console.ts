import { Element } from "./index";
import { create } from "../libs/elements";
import { display } from "./inspect";
import { Editor } from "./editor";

export class Console extends Element {
  content: HTMLElement;
  input: HTMLElement;
  constructor(parent: HTMLElement) {
    super();
    const main = create("div", ["console"]);
    const content = create("div");
    const input = create("div");
    main.style.gridArea = "console";
    main.append(content);
    main.append(input);
    parent.append(main);
    this.element = main;
    this.input = input;
    this.content = content;
  }

  onInput(func: Function): void {
    func();
  }

  log(obj): void {
    this.content.append(display(obj));
  }
}
