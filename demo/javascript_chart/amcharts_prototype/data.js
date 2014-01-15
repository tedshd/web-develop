/*global $, jQuery, alert, console, angular*/
/**
 * Mockup:
 *
 * @authors Ted Shiu (you@example.org)
 * @date    2013-07-16 09:36:15
 * @version $Id$
 */

var chartData, lineArea, storage, monitor, storageMonitor, history, hd, dashboardHdUsageData;
chartData = [
    {
        year: 1930,
        italy: 1,
        germany: 5.3,
        uk: 3
    },
    {
        year: 1934,
        italy: 1.8,
        germany: 2,
        uk: 6
    },
    {
        year: 1938,
        italy: 2,
        germany: 3,
        uk: 1.7
    },
    {
        year: 1950,
        italy: 3,
        germany: 4,
        uk: 1
    },
    {
        year: 1954,
        italy: 5,
        germany: 1,
        uk: 2
    },
    {
        year: 1958,
        italy: 3,
        germany: 2,
        uk: 1
    },
    {
        year: 1962,
        italy: 1,
        germany: 2,
        uk: 3
    },
    {
        year: 1966,
        italy: 2,
        germany: 1,
        uk: 5
    },
    {
        year: 1970,
        italy: 3,
        germany: 5,
        uk: 2
    },
    {
        year: 1974,
        italy: 4,
        germany: 3,
        uk: 6
    },
    {
        year: 1978,
        italy: 1,
        germany: 2,
        uk: 4
    }
];

lineArea = [
    {
        year: 2000,
        cars: 1587,
        motorcycles: 650,
        bicycles: 121
    },
    {
        year: 1995,
        cars: 1567,
        motorcycles: 683,
        bicycles: 146
    },
    {
        year: 1996,
        cars: 1617,
        motorcycles: 691,
        bicycles: 138
    },
    {
        year: 1997,
        cars: 1630,
        motorcycles: 642,
        bicycles: 127
    },
    {
        year: 1998,
        cars: 1660,
        motorcycles: 699,
        bicycles: 105
    },
    {
        year: 1999,
        cars: 1683,
        motorcycles: 721,
        bicycles: 109
    },
    {
        year: 2000,
        cars: 1691,
        motorcycles: 737,
        bicycles: 112
    },
    {
        year: 2001,
        cars: 1298,
        motorcycles: 680,
        bicycles: 101
    },
    {
        year: 2002,
        cars: 1275,
        motorcycles: 664,
        bicycles: 97
    },
    {
        year: 2003,
        cars: 1246,
        motorcycles: 648,
        bicycles: 93
    },
    {
        year: 2004,
        cars: 1218,
        motorcycles: 637,
        bicycles: 101
    },
    {
        year: 2005,
        cars: 1213,
        motorcycles: 633,
        bicycles: 87
    },
    {
        year: 2006,
        cars: 1199,
        motorcycles: 621,
        bicycles: 79
    },
    {
        year: 2007,
        cars: 1110,
        motorcycles: 210,
        bicycles: 81
    },
    {
        year: 2008,
        cars: 1165,
        motorcycles: 232,
        bicycles: 75
    },
    {
        year: 2009,
        cars: 1145,
        motorcycles: 219,
        bicycles: 88
    },
    {
        year: 2010,
        cars: 1163,
        motorcycles: 201,
        bicycles: 82
    },
    {
        year: 2011,
        cars: 1180,
        motorcycles: 285,
        bicycles: 87
    },
    {
        year: 2012,
        cars: 1159,
        motorcycles: 277,
        bicycles: 71
    }
];

storage = [
    {
        user: 'Ted',
        total: '10',
        used: '5'
    },
    {
        user: 'Hunter',
        total: '100',
        used: '10'
    },
    {
        user: 'Jason',
        total: '50',
        used: '3'
    },
    {
        user: 'Vivian',
        total: '30',
        used: '7'
    },
    {
        user: 'milo',
        total: '50',
        used: '30'
    },
    {
        user: 'Jex',
        total: '80',
        used: '17'
    },
    {
        user: 'Free',
        total: '780',
        used: '0'
    }
];
storageMonitor = [
    {
        time: '1',
        Ted: 80,
        Jason: 40,
        Jex: 50,
        Ting: 100,
        Vivian: 10
    },
    {
        time: '2',
        Ted: 55,
        Jason: 30,
        Jex: 55,
        Ting: 100,
        Vivian: 10
    },
    {
        time: '3',
        Ted: 80,
        Jason: 40,
        Jex: 57,
        Ting: 100,
        Vivian: 10
    },
    {
        time: '4',
        Ted: 80,
        Jason: 40,
        Jex: 50,
        Ting: 100,
        Vivian: 5
    },
    {
        time: '5',
        Ted: 70,
        Jason: 40,
        Jex: 30,
        Ting: 108,
        Vivian: 3
    },
    {
        time: '6',
        Ted: 30,
        Jason: 45,
        Jex: 70,
        Ting: 10,
        Vivian: 15
    }
];
history = [
    {
        date: '01',
        used: '10',
        gb: '10GB'
    },
    {
        date: '02',
        used: '15',
        gb: '15GB'
    },
    {
        date: '03',
        used: '50',
        gb: '50GB'
    },
    {
        date: '04',
        used: '20',
        gb: '20GB'
    },
    {
        date: '05',
        used: '10',
        gb: '30GB'
    },
    {
        date: '06',
        used: '55',
        gb: '55GB'
    }
];
hd = [
    {
        'title': 'HD',
        '01': 100,
        '01gb': '0.1GB',
        '02': 4000,
        '02gb': '4GB',
        '03': 500,
        '03gb': '0.5GB',
        '04': 3200,
        '04gb': '3.2GB'
    }
];
dashboardHdUsageData = [{
    "category": "\u786c\u789f\u4f7f\u7528\u5bb9\u91cf",
    "default": 40060,
    "defaultDesc": "39.12 GB",
    "samba": 0,
    "sambaDesc": "0 B",
    "tmp": 1045,
    "tmpDesc": "1.02 GB",
    "trashcan": 0,
    "trashcanDesc": "0 B",
    "free": 8835,
    "freeDesc": "8.63 GB"
}];