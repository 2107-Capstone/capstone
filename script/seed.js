'use strict'

const { db, models: { User, Category, Event, Expense, Message, Trip, UserTrip, UserFriend } } = require('../server/db')

/////// import image //////////////////
const airplane = '/images/airplane.png'
const jonathanAvatar = 'data:image/jpeg;base64,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'
const andyAvatar = 'data:image/jpeg;base64,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'
const corinneAvatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gODAK/9sAQwAGBAUGBQQGBgUGBwcGCAoQCgoJCQoUDg8MEBcUGBgXFBYWGh0lHxobIxwWFiAsICMmJykqKRkfLTAtKDAlKCko/9sAQwEHBwcKCAoTCgoTKBoWGigoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgo/8AAEQgAlgCWAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A6PfRupgBpQtdxxDt1IWpMUEUAIW4qq13DgnzUwOpzTNTbbCMkhc5YjqBXlnjTxDbKzW9o0ksw4Ys+VQ9+O59ulJuwJXNnxZ41SBZYLBw0nKrtHDdiS2emfTrj8/Lbqea6maSdmaVzk54qNiWO4nnoKM46msXJvc0SsSoVjBG0E0wyLkk/Mf0FRE5pKVxkglYfcG36Ug3MecsTTKm3BR0zQAwBieF6c0mTnOacXJ7nHtUdICW3naBiV7qV6+oxUbOzNuZiW9SaTHvRigCVrmZoRC8jNEDkKTkA+1MVtpyPyptFAErAHBFFMjfb1GRRUisfUmKMVN5Zo8o11EEBpjnHerJiNZHiG3vPshksM+evIGMg/4UxHLeO/ED6Vp0qQHM0g2RuB931P5V4tI5dyzEkk5JNdT44uNRnuIv7RhaIruwNoAPPXgDP1NcxBC88ojiUsx7CsJyuzSK7Ais5CqCxPQDmn3VtNbttnQxtgNtbg4PSvRPDHgS5uNLa9E5guDzGdueMf8A165DUdNf+1LtNz3BjYqZCd25h1571lzps6HQlFXZhUtXrnTLm2jWSWNlVhkEiqR6VSd9jFxcdGJnPWnqNwz+lMp2flqhDtwHBpp5OcU00ZpAOBx0JB9qZS0lABRRRQAUUUUAfXQUU7aKhElOElbkEuwU1olPBGRTRJSh6BXPP/ip4bS70aSe0jUXEYD8DkgZ7/ia4n4WaNBcvcXV1g4IRVPpjJ/pXq3jyeWHw1evbSIlx5e2PcQOTx374zXjPgd7jTvENtCZFKTt5bKrZGT0z+NYYjY6cIveuz0TxR4v0/RomsSjyOUxsQ4Arz+18Sr9sY2unwOjHIiKs+M9eaj8bQRR61cSTbmbPOTVOPWLa2tUSzk8qTHzbExz/vf/AFq5Yq60R3Tm1LVpHReLfENvqOkxx3VhPp8qqQuI8xucY78iuBsdPub+YJbRM2T17CtK1vILi9Et6zztn/lo2a69Ncs4owml2SC6ZcA44X3NPncNEiPZqs+aT0PPr6xlsr97SXBkQ4OKZdw+SVB4PcV0evabNZarYTXG4tOfmJ6ls/8A16b41tvLjtbgqFaXJAA7dqtVLtLuZSw9oyfY5Wil7UlbHIFFFFABRRRQAUUUUAfV4NOFV/No82ugxuWxUijNUxLUqS0WC6M3xVYzTWDzWqq80YLKr425x1Oa8v8AA+g3KXMWr6u58uMbraHGCx7MfQeg/wAn0/VNbjQPbxlTkFWJ5+orl7i9LykYY45yRxXJXqJ6I9LCUJL3pHMeILFruSa4kiyTk4rjU0e4mZVgtmYj+I17VpaW99uBQEdDWla6JaWzF1jrljJx2O2dKNTVnjul+B7u5mHmHaPavStF8JW1hboDAm8EMXbktXTRvDCg2qFqvfamixnkDHeonJy3NKVKMPhRwnxUtlbSUniAEkDhwcVyPjWT7ToemTYwdoJ/EV0vjG6+2Wk0R6EGuQ1NvP0KKJuXiUKPwp03t6k1435vNHJiiiiu88QKKKKACiiigAooooA+ngTUi0xakUiuk5x6CpBxTFIp4IoBnjfj+yvtH1d54ZGeCUmWM7uUGeQfxI596o2/i65W18i6jA44b1r1LxxdWkGhSw3bhBcfuwSufrXE6bp2j3J8yB4pdnVe4/A1w14xjKx62FlOUea5r/D+ad4WnmBVHJK7h2rq7u+ZBgNWJbXUcaKkWABwMUl3KZF6Zx6Vy7netEOudTY8BiRWTfXp2nL59qZOpANU5YnkwCvH0qWUmY99I0zMOcGs+4t32EYwprpxYrtJPWql9bhEPuPyoTCUbrU87u4TDKQaiYDAIrbv7b7RfhUHyxxmRz6KOtZcLxrKwMYdWGBu7e9d0ZXR41SFpFaipJ4mifawx6e4qOqMWrBRRRTAKKKKAPpUS1IJazBL71IstdnKcXOaayVKr1QicdzVpZkHek7IuKctjnfiHb215o8dvcTeS7SBo2xnGOv868uGm28bMbTUpDIDgPt2g16z4w05Nc0hrdcCVWDI/wDd9f0rj7TwiunKHmbe/pXBiJe9e56+EjamouPzKehSXlptjvXDqT8jgHkV2MUieT1zkdq5+4j3FQMfL0x2ponKAgvXK3c7Yrl0NSQK0hyc/wAqcHiVcYyaxnvwo5Paqh1Jd2c8e9TY05kdA8kZ/wD1VkawyHOCKpyaooXAPT3rLvtR8xWGcCmo6kSqKxQs7yCHXJFuyRbTRmF2H8IPemXfhu5ikMkEkEttnImWVQMepyciqHkG4kZulJPCyx45roWmx571T5kP1m9S6NtHGBiGMIWxgsep/U1m0p4NJWyVkc0pOTuwooqSCJppVjQZY9KCSOitmy0yOVJIrgtFOjA5weQRRS5kWqbZ7GM04vtFV7i6SMdayrvVFAIDV1zrKOxx0sM3qzYe/CdTVdtWAzg81zb3ZmbqamiKY55rjlUbPRhTUdjbOurBA7SnGWH9a5/UPFQlc/MAtJqHkTQtFIMqRXL3GhhnP2e6P0cf1FZWUtzZVXBWRqza8pHBHSsybWCx61Sm0K/RWYbHUDJIbHH41RnsrqBQ00LquM5xkU1TRDryNGTU2PQ4qs9+xzk1ngE1IkRPaq5EifayZObp26VLEktwwAB5p1taliMiui0yx24O39KzlJLY2pwlLcis9OMcG4jk1najFtJFdx9mH2f0xXOarbfMcDj+dZRlqdM6fu2Rxky4apbaxubqOR7eF5BHjdgdM9KsXsGx+ld/pUUcemW6W8aorLk4HU+tdXPoed7K8nc86bTrtELPbyKB6ripbGxleQY3RyY3qTwCMdj616e5iijO8Ak9axgYYSqwoAq/d9h6Uudj9kkXdLsoo5DcSZMjrhsoFyc5ziioku1HGaKixumZGpa2zkhCRWZHeuzZYmkkt9x9aaLc9hWjZyal6K9x3qb7eSODWZ5DehqUQMF6GpZV2TyXTsetS2hdmzmqJicHkGrlpvTHFSCZfvmf7Eyd5MR/mcU4RtJwygqeCD3FV5JzJdQJjhSXP5YH8/0rZs9rkAim9kUtWzh72w+y3ckZHAPH0p0ES11XiyxV44riP7y/K4H6GubRCrKQM0m7msUkaNha5YcfhXQWcYQHNZmmcYLn8BWtJyvHSsJHZAsCUOMHhRVG5t/MLHHFOiUlx1xWs8UcNqZJGVFUbizHAAqbdjS6tqcVfaYX3Njis1tav9LdbdZIpEUY2Ecr7HFbslzca3O0OkhorUHD3TDBPsg7fXr9Kde+FYfsHkxDaw5EnU5966ItQ0kcVSLqawMWLxP5h/0qFh7oc/oasf2rb3IxG4Q+jcGuXvbSayuGhuEKuPyPuKi6DrzW/KmcftJLRnVG6K9OR7UVyyO6/cZgfY0UuQftWdYjjuKtQ7GxxVYQ8VIgKmpNDSitkPapfsikcVXgkwBzVtZgB1qS0kN+wA9qcNPwOBTxcY6Gp4bjuTSsHKjKt7FnvLhwOEIjH4DJ/nWlFE8R6VNositZiRusrNJ/30cj9MVcllQjoDTktRQjpczLo+ZA6SEBSOSTwK58W+xyGwCDiq/i3VxM7WVofkX/AFrDv7VbLF7a3l5/eRqx9zjmplFpFU5JtouRERoMcVZhuC4xmsvJePIz9asWs6WsYkkw7H7iE4z7n0FZ8tzpUrF6+vF02xNzMB1wo9TUWkWWoeLDFJqJMWmIdyQrx5p9TWVp8DeIdYU3DM9pEe/8f0HZfavWNMgSCJVQAKOgFN+5tuTFOq7vYqR6ZFbRrHBGqoowABgCop7T5SWH+Fb7BQtcd458SRaLahIdkl5J9xD0Uf3jUxi2zaclBXZx/wARWSKK2iCJ5jsWzjkAe/4/pXCmrWo31zqNwZ7uVpJD3PYegqtgetdkI8qseRVnzyuhKKdgf3v0oqzM6ZLpiO9PExPrRRWZ03HrO3rUyXDepoopDuTRzk9afczMlpLtPJXaD6Z4ooojugk/dZcjmMUaonCqABWb4h1WS1tAke4SS5G70H+NFFEdwqNqOhx8SedcRw5x5jgE/U16Jptut5oNnIAF+UgD0G44H5UUUq2wYX4mTixWCBehZzgZ6Vj3dl9o1F7QvwsYllb+8OyiiisUdcjrfDWlR26BuCTzxXSSXAhXhTRRUmq0RwPizx7cW00llp0OyReGlk5x9B/j+Vef3s0t3M091LJNM3LO5yTRRXXTikrnl15ycrNkHlrjOOlNCAmiitLGA/y0HXNFFFOwrn//2Q=='

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const users = await Promise.all([

    User.create({ username: 'Andy', password: '123', firstName: 'Andy', lastName: 'Gao', email: 'andy@123.com', phoneNumber: '1234567890', lat: 40.699251, lng: -73.953755, time: new Date(), avatar: andyAvatar }),
    User.create({ username: 'Corinne', password: '123', firstName: 'Corinne', lastName: 'Tinacci', email: 'corinne@123.com', phoneNumber: '2345678901', lat: 40.717989, lng: -73.951693, time: new Date(), avatar: corinneAvatar }),
    User.create({ username: 'Jonathan', password: '123', firstName: 'Jonathan', lastName: 'Martinez', email: 'jonathan@123.com', phoneNumber: '3456789012', lat: 40.717989, lng: -73.951693, time: new Date(), avatar: jonathanAvatar }),
    User.create({ username: 'Stanley', password: '123', firstName: 'Stanley', lastName: 'Lim', email: 'stanley@123.com', phoneNumber: '4567890123', lat: 40.717989, lng: -73.951693, time: new Date() }),
    User.create({ username: 'Jason', password: '123', firstName: 'Jason', lastName: 'Williams', email: 'jason@123.com', phoneNumber: '5678901234', lat: 40.717989, lng: -73.951693, time: new Date() }),
    User.create({ username: 'Moe', password: '123', firstName: 'Moe', lastName: 'Moeman', email: 'moe@123.com', phoneNumber: '6789012341', lat: 40.717989, lng: -73.951693, time: new Date() }),
    User.create({ username: 'Poe', password: '123', firstName: 'Poe', lastName: 'Poet', email: 'Poe@123.com', phoneNumber: '6789012342', lat: 40.717989, lng: -73.951693, time: new Date() }),
    User.create({ username: 'Lucy', password: '123', firstName: 'Lucy', lastName: 'Luck', email: 'Lucy@123.com', phoneNumber: '6789012343', lat: 40.717989, lng: -73.951693, time: new Date() }),
    User.create({ username: 'JJ', password: '123', firstName: 'JJ', lastName: 'Jay', email: 'jj@123.com', phoneNumber: '6789012340', lat: 40.717989, lng: -73.951693, time: new Date() }),
    User.create({ username: 'Marge', password: '123', firstName: 'Marge', lastName: 'Bouvier', email: 'marge@123.com', phoneNumber: '6789012349', lat: 40.717989, lng: -73.951693, time: new Date() }),
    User.create({ username: 'Prof', password: '123', firstName: 'Prof', lastName: 'Profman', email: 'prof@123.com', phoneNumber: '1239012349', lat: 40.717989, lng: -73.951693, time: new Date() }),

  ])

  const [andy, corinne, jonathan, stanley, jason, prof] = users.map(user => user)

  const trips = await Promise.all([
    Trip.create({ name: 'Trip to NYC', location: 'New York, NY', description: 'A group trip to NYC!', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qW_5nGteBkgrTUQb2QxbtKdTuJd2HcCpZ9TRFSDsi1_iNFTzBRyz3pRY9cV0Lst6sHiF4tkAFDLNgIgKOeCKFIof7GebFJXJE=s1600-w4032', startTime: '2022-01-07 12:00:00', endTime: '2022-01-14 23:59:59', isOpen: true, lat: 40.712776, lng: -74.005974, creatorId: andy.id, creatorName: andy.username }),
    Trip.create({ name: 'Trip to Charlotte', location: 'Charlotte, NC', description: 'A group trip to Charlotte!', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qFrlXaH_sLHU0REAkEOyptZnIJ3_Yddyeb8QSHQXR9wk2FsI6wsKDfSJOyjcw6-QpJ64O1LrJPRrxnMsiFIsNydfOMcMRFfhM=s1600-w1080', startTime: '2021-12-01 12:00:00', endTime: '2021-12-03 23:59:59', isOpen: true, lat: 35.227085, lng: -80.843124, creatorId: jonathan.id, creatorName: jonathan.username  }),
    Trip.create({ name: 'Trip to Miami', location: 'Miami, FL', description: 'A group trip to Miami!', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qveJ4lsmw7U_l8zUnBWDBLMCImIIT2I9mCX1Gvbgys7XbgGtRl6GyB-l7rRccc-azR-UGA3Wc5EsU61QJKXxSwZGxV0eZkFVw=s1600-w2560', startTime: '2021-12-12 12:00:00', endTime: '2021-12-15 23:59:59', isOpen: true, lat: 25.761681, lng: -80.191788, creatorId: jonathan.id, creatorName: jonathan.username  }),
    Trip.create({ name: 'Trip to Paris', location: 'Paris, France', description: 'A group trip to Paris!', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qAEVTGSbA79pzizPEYGJ0Cpwk637M1DP_nOw6-MVGLohKktj7dJY6E67Xz-PCCqSAWvyZy6e3wF3zF-H7v-MARpAx44w1AH38=s1600-w600', startTime: '2021-12-20 12:00:00', endTime: '2021-12-30 23:59:59', isOpen: true, lat: 48.87531999859082, lng: 2.3302103060471153, creatorId: jason.id, creatorName: jason.username }),
    Trip.create({ name: 'Friday night!', location: 'New York, NY', description: 'Weekend hangout with the gang in the new year', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qW_5nGteBkgrTUQb2QxbtKdTuJd2HcCpZ9TRFSDsi1_iNFTzBRyz3pRY9cV0Lst6sHiF4tkAFDLNgIgKOeCKFIof7GebFJXJE=s1600-w4032', startTime: '2022-01-07 20:00:00', endTime: '2022-01-08 05:00:00', isOpen: true, lat: 40.712776, lng: -74.005974, creatorId: corinne.id, creatorName: corinne.username }),
    Trip.create({ name: 'NYE', location: 'New York, New York', description: 'New Years Eve', imageUrl: 'https://lh3.googleusercontent.com/places/AAcXr8qW_5nGteBkgrTUQb2QxbtKdTuJd2HcCpZ9TRFSDsi1_iNFTzBRyz3pRY9cV0Lst6sHiF4tkAFDLNgIgKOeCKFIof7GebFJXJE=s1600-w4032', startTime: '2021-12-31 20:00:00', endTime: '2022-01-01 03:00:00', isOpen: true, lat: 40.712776, lng: -74.005974, creatorId: andy.id, creatorName: andy.username })
  ])

  const [nyc, charlotte, miami, paris, friday, nye] = trips.map(trip => trip)

  const categories = await Promise.all([
    Category.create({ name: 'Food and Drink' }),
    Category.create({ name: 'Entertainment' }),
    Category.create({ name: 'Transportation' }),
    Category.create({ name: 'Other' }),
  ])

  const [food_and_drink, entertainment, transportation, other] = categories.map(category => category)

  const events = await Promise.all([
    Event.create({ name: 'Movie', location: 'AMC Lincoln Square 13', description: 'Eternals', startTime: '2022-01-08 21:15:00', endTime: '2022-01-08 23:15:00', tripId: nyc.id, place_id: 'ChIJtcljhoZYwokRQZjDXiCA304', lat: 40.7751676, lng: -73.9819053 }),
    Event.create({ name: 'Dinner', location: 'Lilia', description: "pasta pasta pasta", startTime: '2022-01-09 20:00:00', endTime: '2022-01-09 22:00:00', tripId: nyc.id, place_id: 'ChIJJXCD6ltZwokRJ_cwjKQH63c', lat: 40.7175365, lng: -73.9524225 }),
    Event.create({ name: 'Museum', location: 'The Whitney Museum', description: 'culture time', startTime: '2022-01-11 10:15:00', endTime: '2022-01-11 12:15:00', tripId: nyc.id, place_id: 'ChIJN3MJ6pRYwokRiXg91flSP8Y', lat: 40.7395877, lng: -74.0088629 }),
    Event.create({ name: 'Hiking', location: 'Rocky Face Mountain', description: 'Group hiking', startTime: '2021-12-02 08:00:00', endTime: '2021-12-02 10:00:00', tripId: charlotte.id, place_id: 'ChIJdenvAr6bWYgRLX-EhoXIm4s', lat: 35.4653854, lng: -82.7992976 }),
    Event.create({ name: 'Party', location: "Infused Bar", description: '', startTime: '2021-12-02 20:00:00', endTime: '2021-12-02 23:00:00', tripId: charlotte.id, place_id: 'ChIJ_4Hm7SGgVogRNoZBXcKQn74', lat: 35.223096, lng: -80.8332363 }),
    Event.create({ name: 'Museum', location: 'Perez Art Museum Miami', description: 'Museum visit', startTime: '2021-12-13 08:00:00', endTime: '2021-12-13 10:00:00', tripId: miami.id, place_id: 'ChIJAUUpLJq22YgRAU604E8-tsM', lat: 25.7859307, lng: -80.1861912 }),
    Event.create({ name: 'Party', location: 'Mama Tried', description: 'cocktails and pool', startTime: '2021-12-14 20:00:00', endTime: '2021-12-14 03:00:00', tripId: miami.id, place_id: 'ChIJL7nwMRi32YgRPgB_p4PMTXk', lat: 25.7753682, lng: -80.1901163 }),
    Event.create({ name: 'Dinner', location: 'Comice', description: 'Dinner at Comice', startTime: '2021-12-21 20:00:00', endTime: '2021-12-21 22:59:59', tripId: paris.id, place_id: 'ChIJAc56Jah65kcRPUvIVLIaIjI', lat: 48.8494621, lng: 2.2760438 }),
    Event.create({ name: 'Museum', location: 'Louvre', description: 'art!!', startTime: '2021-12-23 10:00:00', endTime: '2021-12-23 13:00:00', tripId: paris.id, place_id: 'ChIJPStI0CVu5kcRUBqUaMOCCwU', lat: 48.8640396, lng: 2.3311563 }),
    Event.create({ name: 'Dinner', location: 'Francie', description: "start the evening with some duck", startTime: '2022-01-07 20:00:00', endTime: '2022-01-07 22:30:00', tripId: friday.id, place_id: 'ChIJ35V_tZlbwokRzolpCln-mG4', lat: 40.710268, lng: -73.9639045 }),
    Event.create({ name: 'Drinks', location: 'Pokito', description: 'cocktails', startTime: '2022-01-07 23:00:00', endTime: '2022-01-08 01:00:00', tripId: friday.id, place_id: 'ChIJ3xcwmt9bwokRegnPhKtAL7U', lat: 40.71161300000001, lng: -73.9618029 }),
    Event.create({ name: 'Dancing', location: 'Moodring', description: 'cool dj and dancing yay', startTime: '2022-01-08 01:30:00', endTime: '2022-01-08 04:00:00', tripId: friday.id, place_id: 'ChIJp5MjfgVcwokREwMdmFvtrQ8', lat: 40.6978453, lng: -73.92699999999999 }),
  ])

  const expenses = await Promise.all([
    Expense.create({ name: 'Movie tickets', amount: 60, tripId: nyc.id, paidById: andy.id, categoryId: entertainment.id, datePaid: '2022-01-08' }),
    Expense.create({ name: 'dinner', amount: 200, tripId: nyc.id, paidById: corinne.id, categoryId: food_and_drink.id, datePaid: '2022-01-09' }),
    Expense.create({ name: 'whitney', amount: 80, tripId: nyc.id, paidById: andy.id, categoryId: entertainment.id, datePaid: '2022-01-11' }),
    Expense.create({ name: 'Uber to Rocky Face Mountain', amount: 35, tripId: charlotte.id, paidById: jonathan.id, categoryId: transportation.id, datePaid: '2021-12-02' }),
    Expense.create({ name: 'drinks', amount: 150, tripId: charlotte.id, paidById: andy.id, categoryId: food_and_drink.id, datePaid: '2021-12-03' }),
    Expense.create({ name: 'Museum tickets', amount: 80, tripId: miami.id, paidById: corinne.id, categoryId: entertainment.id, datePaid: '2021-12-13' }),
    Expense.create({ name: 'car', amount: 30, tripId: miami.id, paidById: andy.id, categoryId: transportation.id, datePaid: '2021-12-14' }),
    Expense.create({ name: 'museum gift shop', amount: 65, tripId: miami.id, paidById: jonathan.id, categoryId: other.id, datePaid: '2021-12-13' }),
    Expense.create({ name: 'Dinner at Comice', amount: 150, tripId: paris.id, paidById: corinne.id, categoryId: food_and_drink.id, datePaid: '2021-12-21' }),
  ])

  const userTrips = await Promise.all([

    UserTrip.create({ userId: andy.id, tripId: nyc.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: andy.id, tripId: charlotte.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: andy.id, tripId: miami.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: corinne.id, tripId: nyc.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: corinne.id, tripId: miami.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: corinne.id, tripId: paris.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: jonathan.id, tripId: charlotte.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: jonathan.id, tripId: miami.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: jonathan.id, tripId: paris.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: jason.id, tripId: paris.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: jason.id, tripId: friday.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: jonathan.id, tripId: friday.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: corinne.id, tripId: friday.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: andy.id, tripId: friday.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: stanley.id, tripId: friday.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: stanley.id, tripId: nye.id, tripInvite: 'accepted' }),
    UserTrip.create({ userId: andy.id, tripId: nye.id, tripInvite: 'accepted' }),
  ])

  const userFriends = await Promise.all([
    UserFriend.create({ userId: andy.id, friendId: corinne.id, status: 'accepted' }),
    UserFriend.create({ userId: andy.id, friendId: jonathan.id, status: 'accepted' }),
    UserFriend.create({ userId: corinne.id, friendId: andy.id, status: 'accepted' }),
    UserFriend.create({ userId: corinne.id, friendId: jonathan.id, status: 'accepted' }),
    UserFriend.create({ userId: jonathan.id, friendId: andy.id, status: 'accepted' }),
    UserFriend.create({ userId: jonathan.id, friendId: corinne.id, status: 'accepted' }),
    UserFriend.create({ userId: jason.id, friendId: andy.id, status: 'accepted' }),
    UserFriend.create({ userId: jason.id, friendId: corinne.id, status: 'accepted' }),
    UserFriend.create({ userId: jason.id, friendId: jonathan.id, status: 'accepted' }),
    UserFriend.create({ userId: andy.id, friendId: jason.id, status: 'accepted' }),
    UserFriend.create({ userId: jonathan.id, friendId: jason.id, status: 'accepted' }),
    UserFriend.create({ userId: corinne.id, friendId: jason.id, status: 'accepted' }),
    UserFriend.create({ userId: corinne.id, friendId: stanley.id, status: 'accepted' }),
    UserFriend.create({ userId: jonathan.id, friendId: stanley.id, status: 'accepted' }),
    UserFriend.create({ userId: jason.id, friendId: stanley.id, status: 'accepted' }),
    UserFriend.create({ userId: andy.id, friendId: stanley.id, status: 'accepted' }),
    UserFriend.create({ userId: stanley.id, friendId: corinne.id, status: 'accepted' }),
    UserFriend.create({ userId: stanley.id, friendId: jonathan.id, status: 'accepted' }),
    UserFriend.create({ userId: stanley.id, friendId: jason.id, status: 'accepted' }),
    UserFriend.create({ userId: stanley.id, friendId: andy.id, status: 'accepted' }),
    UserFriend.create({ userId: prof.id, friendId: corinne.id, status: 'accepted' }),
    UserFriend.create({ userId: corinne.id, friendId: prof.id, status: 'accepted' }),
  ])

  const messages = await Promise.all([
    Message.create({ content: "Hi, how's it going?", tripId: nyc.id, sentById: andy.id, dateSent: '2021-11-12T05:40:34.000Z' }),
    Message.create({ content: "Great, see you soon!", tripId: nyc.id, sentById: corinne.id, dateSent: '2021-11-12T05:45:34.000Z' }),
    Message.create({ content: "Where are we going to?", tripId: charlotte.id, sentById: jonathan.id, dateSent: '2021-09-23T12:40:34.000Z' }),
    Message.create({ content: "The coolest place in Charlotte!", tripId: charlotte.id, sentById: andy.id, dateSent: '2021-09-23T12:43:34.000Z' }),
    Message.create({ content: "Are you at the airbnb yet?", tripId: miami.id, sentById: jonathan.id, dateSent: '2021-11-12T10:40:34.000Z' }),
    Message.create({ content: "Five mins away", tripId: miami.id, sentById: andy.id, dateSent: '2021-11-12T10:41:34.000Z' }),
    Message.create({ content: "Still at airport!", tripId: miami.id, sentById: corinne.id, dateSent: '2021-11-12T10:43:34.000Z' }),
    Message.create({ content: "Looking forward to it!", tripId: paris.id, sentById: corinne.id, dateSent: '2021-11-08T05:40:34.000Z' }),
    Message.create({ content: "Me too!", tripId: paris.id, sentById: jonathan.id, dateSent: '2021-11-08T09:13:34.000Z' }),
    Message.create({ content: "Can't wait for this!!", tripId: friday.id, sentById: jason.id, dateSent: '2021-12-03T09:13:34.000Z' }),
    Message.create({ content: "I miss you prof :( ", tripId: friday.id, sentById: stanley.id, dateSent: '2021-12-03T09:16:34.000Z' }),
    Message.create({ content: "Don't worry, we'll be reunited soon!", tripId: friday.id, sentById: prof.id, dateSent: '2021-12-03T11:25:34.000Z' }),
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
  return {
    users: {
      andy,
      corinne,
      jonathan,
      jason,
      stanley
    },
    categories: {
      food_and_drink,
      entertainment,
      transportation,
      other
    },
    events,
    expenses,
    messages,
    trips: {
      nyc,
      charlotte,
      miami,
      paris,
      friday,
      nye
    },
    userTrips,
    userFriends
  }
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed