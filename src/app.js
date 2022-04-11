var page = tabris.create("Page", {
  title: "Hello, World!",
  topLevel: true
});
var textView = tabris.create("TextView", {
  font: "24px",
  layoutData: {centerX: 0, top: 100},
  text: "Hello World"
}).appendTo(page);
page.open();
