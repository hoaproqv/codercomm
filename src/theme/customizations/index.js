import Link from "./Link";
import Card from "./Card";
import Tabs from "./Tabs";

export default function customizeComponents(theme) {
  return { ...Link(theme), ...Card(theme), ...Tabs(theme) };
}
