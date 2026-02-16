# Map To Poster

Generate beautiful, minimalist map posters for any city in the world right in your browser. No downloads or setup required.

View the live site at <https://malcolm-hall.github.io/map-to-poster>

<img src="./public/cape_town_south_africa_blueprint.png" width=540>

<img src="./public/durban_south_africa_neon_cyberpunk.png" width=540>

<img src="./public/tokyo_japan_sunset.png" width=540>

<img src="./public/dubai_united_arab_emirates_midnight_blue.png" width=540>

## Attribution

Inspired by [maptoposter](https://github.com/originalankur/maptoposter) by [originalankur](https://github.com/originalankur). Make sure to check out their project if you like this one.

Geocoding and map data provided by [OpenStreetMap](https://www.openstreetmap.org)

## Data Sources

- [Nominatim](https://nominatim.org) - Geocoding
- [Overpass API](https://overpass-api.de) - OpenStreetMap data

### Caching

All map and location data is cached in the browsers local storage for 12 hours. This enables poster styles to be quickly changed and prevents excessive load on the APIs of the data sources.

## Getting Started

Install the dependencies using Node v24+ or equivalent

```sh
npm install
```

Run the dev server and navigate to <http://localhost:5173/map-to-poster/>

```sh
npm run dev
```

## Deployment

Deployed to [GitHub Pages](https://vite.dev/guide/static-deploy) on push to main
