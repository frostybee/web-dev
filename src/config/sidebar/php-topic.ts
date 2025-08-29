export default
  [
    {
      label: "PHP",
      link: "php/basics",
      icon: "seti:php",
      items: [
        // Each item here is one entry in the navigation menu.
        // Direct link to index.mdx file.
        // { label: "Quick Reference", link: "php/" },
        {
          label: "Demo",
          autogenerate: {
            directory: "demos/http-cycle-demo",
          }
        },
        {
          label: "PHP Basics",
          autogenerate: {
            directory: "php/basics",
          }
        },
        {
          label: "Variables and Data Types",
          autogenerate: {
            directory: "php/Data-Types",
          }
        },
        {
          label: "Strings",
          autogenerate: {
            directory: "php/strings",
          }
        },
        {
          label: "Arrays",
          autogenerate: {
            directory: "php/arrays",
          }
        },
        {
          label: "Functions",
          autogenerate: {
            directory: "php/functions",
          }
        }
      ],
    }
  ];
