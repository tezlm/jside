import { create, clear } from "../libs/elements";

function select(el: HTMLElement): void {
  const selection = window.getSelection();
  const range = new Range();

  if (selection.rangeCount > 0) {
    selection.removeAllRanges();
  }

  range.selectNode(el);
  selection.addRange(range);
}

function displayArray(arr: Array<unknown>): HTMLElement {
  let expanded = false;
  const body = create("div", ["expand", "canExpand"]);
  const cont = create("div", ["array"]);
  function toggle(e): void {
    if (!e.target.classList.contains("expand")) return;
    if (e.target.parentNode !== cont) return;
    if (e.detail > 1 && expanded) {
      select(cont);
      return;
    }
    expanded = !expanded;
    if (expanded) {
      cont.classList.remove("expand");
      clear(cont);
      cont.append(create("div", ["expand"], "["));
      for (const i in arr) {
        const item = create("div", ["item"]);
        item.append(displayPart(arr[i]));
        if (Number(i) !== arr.length - 1)
          item.append(create("div", ["comma"], ","));
        cont.append(item);
      }
      if (arr.length > 10) {
        cont.style.display = "block";
      } else {
        cont.style.display = "flex";
      }
      cont.append(create("div", ["expand"], "]"));
    } else {
      cont.classList.add("expand");
      clear(cont);
      cont.append(create("div", ["expand"], "[...]"));
    }
  }
  cont.append(create("div", ["expand"], "[...]"));
  body.append(cont);
  body.addEventListener("click", toggle);
  return body;
}

function displayObject(obj): HTMLElement {
  let expanded = false;
  const body = create("div", ["expand", "canExpand"]);
  const cont = create("div", ["object"]);
  function toggle(e): void {
    if (!e.target.classList.contains("expand")) return;
    if (e.target.parentNode !== cont) return;
    if (e.detail > 1 && expanded) {
      select(cont);
      return;
    }
    expanded = !expanded;
    if (expanded) {
      cont.classList.remove("expand");
      clear(cont);
      cont.append(create("div", ["expand"], "{"));
      for (const i in obj) {
        const item = create("div", ["item"]);
        const key = create("div", ["key"], i);
        item.append(key);
        item.append(create("div", ["colon"], ":"));
        item.append(displayPart(obj[i]));
        cont.append(item);
      }
      cont.append(create("div", ["expand"], "}"));
    } else {
      cont.classList.add("expand");
      clear(cont);
      cont.append(create("div", ["expand"], "{...}"));
    }
  }
  cont.append(create("div", ["expand"], "{...}"));
  body.append(cont);
  body.addEventListener("click", toggle);
  return body;
}

function displayFunction(func: Function): HTMLElement {
  const str = func.toString();
  const preview = str.length < 35 ? str : str.slice(0, 33) + "...";
  return create("div", ["function"], preview);
}

function displayError(err: Error): HTMLElement {
  const main = err.toString();
  const stack = ""; //err.stack; // problem with vm2
  return create("div", ["error"], main + stack);
}

function displayPart(thing): HTMLElement {
  if (typeof thing === "undefined")
    return create("div", ["value", "undefined"], "undefined");
  switch (typeof thing) {
    case "string":
      return create("div", ["value", "string"], `"${thing}"`);
      break;
    case "number":
      return create("div", ["value", "number"], thing.toString());
      break;
    case "boolean":
      return create("div", ["value", "boolean"], thing.toString());
      break;
    case "object":
      if (thing === null) return create("div", ["value", "number"], "null");
      if (thing instanceof Array) return displayArray(thing);
      if (thing instanceof Error) return displayError(thing);
      return displayObject(thing);
    case "function":
      return displayFunction(thing);
      break;
    default:
      return create("div", ["value"], thing);
  }
}

export function display(thing): HTMLElement {
  const disp = create("div", ["display"]);
  disp.append(displayPart(thing));
  return disp;
}