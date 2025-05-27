import React from 'react';
import { 
  WrenchScrewdriverIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: WrenchScrewdriverIcon,
      title: 'Профессиональное оборудование',
      description: 'Современное диагностическое и ремонтное оборудование от ведущих производителей'
    },
    {
      icon: UserGroupIcon,
      title: 'Опытные мастера',
      description: 'Команда сертифицированных специалистов с многолетним опытом работы'
    },
    {
      icon: ClockIcon,
      title: 'Быстрое обслуживание',
      description: 'Оперативное выполнение работ без потери качества'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Гарантия качества',
      description: 'Гарантия на все виды выполненных работ и установленные запчасти'
    },
    {
      icon: TrophyIcon,
      title: 'Лучшие цены',
      description: 'Конкурентные цены на все виды услуг и запчасти'
    },
    {
      icon: HeartIcon,
      title: 'Индивидуальный подход',
      description: 'Персональное обслуживание каждого клиента'
    }
  ];

  const stats = [
    { number: '10+', label: 'Лет опыта' },
    { number: '5000+', label: 'Довольных клиентов' },
    { number: '50+', label: 'Видов услуг' },
    { number: '24/7', label: 'Поддержка' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          О компании СуперСТО
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Мы - команда профессионалов, которая уже более 10 лет предоставляет качественные услуги 
          по техническому обслуживанию и ремонту автомобилей. Наша миссия - обеспечить безопасность 
          и надежность вашего автомобиля.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {stat.number}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Почему выбирают нас
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="card p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Наша история
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            СуперСТО была основана в 2013 году группой энтузиастов автомобильного дела. 
            Начав с небольшой мастерской, мы постепенно расширялись, инвестируя в современное 
            оборудование и обучение персонала.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Сегодня мы располагаем несколькими сервисными центрами, оснащенными самым современным 
            диагностическим и ремонтным оборудованием. Наша команда состоит из высококвалифицированных 
            специалистов, регулярно проходящих обучение и сертификацию.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Мы гордимся тем, что за годы работы завоевали доверие тысяч клиентов и стали одним 
            из ведущих автосервисов в регионе. Наш принцип - честность, качество и забота о каждом клиенте.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Наши ценности
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Качество
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Мы используем только оригинальные запчасти и современные технологии ремонта
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Честность
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Прозрачное ценообразование и честная диагностика без навязывания лишних услуг
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Забота
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Индивидуальный подход к каждому клиенту и забота о вашем автомобиле
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 