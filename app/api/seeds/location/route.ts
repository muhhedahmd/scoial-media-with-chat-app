import { faker } from '@faker-js/faker';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Country } from '@prisma/client';

// Helper to convert country code to flag emoji
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Map of country names to their ISO codes
const countryToCode: { [key: string]: string } = {
  Afghanistan: 'AF',
  Albania: 'AL',
  Algeria: 'DZ',
  Andorra: 'AD',
  Angola: 'AO',
  Antigua_And_Barbuda: 'AG',
  Argentina: 'AR',
  Armenia: 'AM',
  Australia: 'AU',
  Austria: 'AT',
  Azerbaijan: 'AZ',
  Bahamas: 'BS',
  Bahrain: 'BH',
  Bangladesh: 'BD',
  Barbados: 'BB',
  Belarus: 'BY',
  Belgium: 'BE',
  Belize: 'BZ',
  Benin: 'BJ',
  Bhutan: 'BT',
  Bolivia: 'BO',
  Bosnia_And_Herzegovina: 'BA',
  Botswana: 'BW',
  Brazil: 'BR',
  Brunei: 'BN',
  Bulgaria: 'BG',
  Burkina_Faso: 'BF',
  Burundi: 'BI',
  Cabo_Verde: 'CV',
  Cambodia: 'KH',
  Cameroon: 'CM',
  Canada: 'CA',
  Central_African_Republic: 'CF',
  Chad: 'TD',
  Chile: 'CL',
  China: 'CN',
  Colombia: 'CO',
  Comoros: 'KM',
  Congo: 'CG',
  Costa_Rica: 'CR',
  Croatia: 'HR',
  Cuba: 'CU',
  Cyprus: 'CY',
  Czech_Republic: 'CZ',
  Democratic_Republic_Of_The_Congo: 'CD',
  Denmark: 'DK',
  Djibouti: 'DJ',
  Dominica: 'DM',
  Dominican_Republic: 'DO',
  Ecuador: 'EC',
  Egypt: 'EG',
  El_Salvador: 'SV',
  Equatorial_Guinea: 'GQ',
  Eritrea: 'ER',
  Estonia: 'EE',
  Eswatini: 'SZ',
  Ethiopia: 'ET',
  Fiji: 'FJ',
  Finland: 'FI',
  France: 'FR',
  Gabon: 'GA',
  Gambia: 'GM',
  Georgia: 'GE',
  Germany: 'DE',
  Ghana: 'GH',
  Greece: 'GR',
  Grenada: 'GD',
  Guatemala: 'GT',
  Guinea: 'GN',
  Guinea_Bissau: 'GW',
  Guyana: 'GY',
  Haiti: 'HT',
  Honduras: 'HN',
  Hungary: 'HU',
  Iceland: 'IS',
  India: 'IN',
  Indonesia: 'ID',
  Iran: 'IR',
  Iraq: 'IQ',
  Ireland: 'IE',
  Israel: 'IL',
  Italy: 'IT',
  Jamaica: 'JM',
  Japan: 'JP',
  Kazakhstan: 'KZ',
  Kenya: 'KE',
  Kiribati: 'KI',
  Korea_North: 'KP',
  Korea_South: 'KR',
  Kosovo: 'XK',
  Kuwait: 'KW',
  Kyrgyzstan: 'KG',
  Laos: 'LA',
  Latvia: 'LV',
  Lebanon: 'LB',
  Lesotho: 'LS',
  Liberia: 'LR',
  Libya: 'LY',
  Liechtenstein: 'LI',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Madagascar: 'MG',
  Malawi: 'MW',
  Malaysia: 'MY',
  Maldives: 'MV',
  Mali: 'ML',
  Malta: 'MT',
  Marshall_Islands: 'MH',
  Mauritania: 'MR',
  Mauritius: 'MU',
  Mexico: 'MX',
  Micronesia: 'FM',
  Moldova: 'MD',
  Monaco: 'MC',
  Mongolia: 'MN',
  Montenegro: 'ME',
  Morocco: 'MA',
  Mozambique: 'MZ',
  Myanmar: 'MM',
  Namibia: 'NA',
  Nauru: 'NR',
  Nepal: 'NP',
  Netherlands: 'NL',
  New_Zealand: 'NZ',
  Nicaragua: 'NI',
  Niger: 'NE',
  Nigeria: 'NG',
  North_Macedonia: 'MK',
  Norway: 'NO',
  Oman: 'OM',
  Pakistan: 'PK',
  Palau: 'PW',
  Palestine: 'PS',
  Panama: 'PA',
  Papua_New_Guinea: 'PG',
  Paraguay: 'PY',
  Peru: 'PE',
  Philippines: 'PH',
  Poland: 'PL',
  Portugal: 'PT',
  Qatar: 'QA',
  Romania: 'RO',
  Russia: 'RU',
  Rwanda: 'RW',
  Saint_Kitts_And_Nevis: 'KN',
  Saint_Lucia: 'LC',
  Saint_Vincent_And_The_Grenadines: 'VC',
  Samoa: 'WS',
  San_Marino: 'SM',
  Sao_Tome_And_Principe: 'ST',
  Saudi_Arabia: 'SA',
  Senegal: 'SN',
  Serbia: 'RS',
  Seychelles: 'SC',
  Sierra_Leone: 'SL',
  Singapore: 'SG',
  Slovakia: 'SK',
  Slovenia: 'SI',
  Solomon_Islands: 'SB',
  Somalia: 'SO',
  South_Africa: 'ZA',
  Spain: 'ES',
  Sri_Lanka: 'LK',
  Sudan: 'SD',
  Suriname: 'SR',
  Sweden: 'SE',
  Switzerland: 'CH',
  Syria: 'SY',
  Taiwan: 'TW',
  Tajikistan: 'TJ',
  Tanzania: 'TZ',
  Thailand: 'TH',
  Togo: 'TG',
  Tonga: 'TO',
  Trinidad_And_Tobago: 'TT',
  Tunisia: 'TN',
  Turkey: 'TR',
  Turkmenistan: 'TM',
  Tuvalu: 'TV',
  Uganda: 'UG',
  Ukraine: 'UA',
  United_Arab_Emirates: 'AE',
  United_Kingdom: 'GB',
  United_States: 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
  Vanuatu: 'VU',
  Vatican_City: 'VA',
  Venezuela: 'VE',
  Vietnam: 'VN',
  Yemen: 'YE',
  Zambia: 'ZM',
  Zimbabwe: 'ZW',
};


export async function GET() {
  console.log('Start seeding...');
  const locations: {
    street: string;
    city: string;
    state: string;
    zip: string;
    countryEnum : Country
    country: string;
    flag: string;
  }[] = [];

  try {
    const validCountries = Object.values(Country);

    for (let i = 0; i < 1000; i++) {
      const country = faker.helpers.arrayElement(validCountries) as Country;
      const countryCode = countryToCode[country] || 'US'; // Default to US if not found

      locations.push({
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        countryEnum : country,
        country: country.replaceAll("_" , " "),
        flag: getFlagEmoji(countryCode),
      });
    }

    const seedLocations = await prisma.address.createMany({
      data: locations,
      skipDuplicates: true,
    });

    // Fetch a sample of inserted locations
    const sampleLocations = await prisma.address.findMany({
      take: 10,
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({
      message: `Successfully seeded ${seedLocations.count} locations`,
      sampleLocations
    }, {
      status: 200,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { message: 'An error occurred during seeding', error },
      {
        status: 500,
      }
    );
  }
}