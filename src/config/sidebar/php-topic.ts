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
          label: "Strings",
          collapsed: true,
          autogenerate: {
            directory: "php/strings",
          }
        },
        {
          label: "Arrays",
          collapsed: true,
          autogenerate: {
            directory: "php/arrays",
          }
        },
        {
          label: "Functions",
          collapsed: true,
          autogenerate: {
            directory: "php/functions",
          }
        },
        {
          label: "PHP - MySQL Integration",
          collapsed: true,
          autogenerate: {
            directory: "php/pdo",
          }
        },
        {
          label: "Input Methods & Web Forms",
          collapsed: true,
          autogenerate: {
            directory: "php/inputs",
          }
        },
        {
          label: "Security",
          collapsed: true,
          autogenerate: {
            directory: "php/security",
          }
        },
        {
          label: "Slim Framework & MVC",
          collapsed: true,
          items: [
            {
              label: "Slim Framework & MVC",
              autogenerate: {
                directory: "php/slim",
              }
            },
            {
              label: "Slim MVC App",
              autogenerate: {
                directory: "php/slim-mvc",
              }
            }
          ],
        },
      ],
    }
  ];
