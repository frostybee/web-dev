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
          label: "Course Content",
          collapsed: false,
          autogenerate: {
            directory: "php/topics",
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
                collapsed: true,
              }
            },
            {
              label: "Variables and Data Types",
              autogenerate: {
                directory: "php/Data-Types",
                collapsed: true,
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
          label: "Assignment 2",
          collapsed: false,
          autogenerate: {
            directory: "php/assignment-2",
          }
        },
        {
          label: "Labs",
          collapsed: true,
          autogenerate: {
            directory: "php/labs",
          }
        },
        {
          label: "Working with Slim Framework",
          collapsed: false,
          items: [
            {
              label: "Slim Framework & MVC",
              autogenerate: {
                directory: "php/slim",
              }
            },
            {
              label: "Middleware",
              autogenerate: {
                directory: "php/middleware",
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
