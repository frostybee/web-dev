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
          collapsed: true,
          items: [
            {
              label: "Getting Started",
              autogenerate: {
                directory: "php/basics",
                collapsed: false,
              }
            },
            {
              label: "Variables and Data Types",
              autogenerate: {
                directory: "php/Data-Types",
                collapsed: false,
              }
            }
          ]
        },
        {
          label: "Security",
          autogenerate: {
            directory: "php/security",
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
        },
        {
          label: "PHP - MySQL Integration",
          autogenerate: {
            directory: "php/pdo",
          }
        }
      ],
    }
  ];
