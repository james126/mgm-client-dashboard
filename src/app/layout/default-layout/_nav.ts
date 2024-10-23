import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/dashboard',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Typography',
    url: '/dashboard',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Components',
    title: true
  },
  {
    name: 'Base',
    url: '/dashboard',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Accordion',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Breadcrumbs',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Cards',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Carousel',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Collapse',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'List Group',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Navs & Tabs',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Pagination',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Placeholder',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Popovers',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Progress',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Spinners',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tables',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tabs',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tooltips',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/dashboard',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Buttons',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Button groups',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Dropdowns',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Forms',
    url: '/dashboard',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Form Control',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Select',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Checks & Radios',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Range',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Input Group',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Floating Labels',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Layout',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Validation',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Charts',
    iconComponent: { name: 'cil-chart-pie' },
    url: '/dashboard'
  },
  {
    name: 'Icons',
    iconComponent: { name: 'cil-star' },
    url: '/dashboard',
    children: [
      {
        name: 'CoreUI Free',
        url: '/dashboard',
        icon: 'nav-icon-bullet',
        badge: {
          color: 'success',
          text: 'FREE'
        }
      },
      {
        name: 'CoreUI Flags',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'CoreUI Brands',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/dashboard',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Alerts',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Badges',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Modal',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Toast',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/dashboard',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    url: '/dashboard',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Register',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 404',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 500',
        url: '/dashboard',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Docs',
    url: '/dashboard',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
