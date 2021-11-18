export interface Project {
  name: string;
  font?: string;
  items: string[];
}

export interface ProjectDefinition {
  id: string;
  languages: Project[];
}

export default [{
  id: 'american-sports',
  languages: [{
    name: 'American Sports',
    items: [
      'Soccer',
      'Football',
      'Basketball',
      'Baseball',
      'Golf',
      'Tennis',
    ],
  }],
}, {
  id: 'sabzi',
  languages: [{
    name: 'Sabzi',
    items: [
      'aloo',
      'baingan',
      'kadu',
      'pyaaz',
      'gaajar',
      'matar',
      'shimla mirch',
      'phool gobhi',
      'band gobhi',
    ],
  }, {
    name: 'सबजी',
    font: '\'Hind\', sans-serif',
    items: [
      'आलू',
      'बैंगन',
      'कद्दू',
      'प्याज',
      'गाजर',
      'मटर',
      'शिमला मिर्च',
      'फूलगोभी',
      'बंदगोभी',
    ],
  }, {
    name: 'سبزی',
    items: [
      'آلو',
      'بینگن',
      'قددو',
      'پیاز',
      'گاجر',
      'مٹر',
      'شملہ مرچ',
      'پھول گوبھی',
      'بند گوبهی',
    ],
  }],
}] as ProjectDefinition[];
