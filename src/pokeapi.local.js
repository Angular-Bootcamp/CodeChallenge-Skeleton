'use strict';

const request = require('request');
const base64 = require('node-base64-image');
const fs = require('fs');
const progress = require('progress');

/**
 * Pokedex configuration
 *
 * @param {object} apiUrl Pokemon API url
 * @param {integer} min Initial number
 * @param {integer} max Maximum number
 * @param {integer} pad  Maximum number of leading zeros (e.g. 3 = 000)
 * @param {string} filePath File path used to store the pokedex (json format)
 */
const config = {
  apiUrl   : 'http://pokeapi.co/api/v2',
  filePath : './data/pokedex.json',
  min      : 1,
  max      : 151,
  pad      : 3
};

/**
 * ProgressBar instance
 */
const bar = new progress('Populating Pokedex [:bar] :percent :etas', {
  total      : config.max,
  complete   : '=',
  incomplete : ' ',
  width      : 100
});

/**
 * @name padNumber
 * @description Pad a number with leading zeros to "pad" places
 * @param {integer} number The number to pad
 * @param {string} pad The maximum number of leading zeros
 */
function padNumber(number, pad) {
    var N = Math.pow(10, pad);
    return number < N ? ('' + (N + number)).slice(1) : '' + number
}

/**
 * @name getPokemon
 * @description Get the pokemon base information
 * @param {integer} id The pokemon ID
 * @return {object} pokemonData The pokemon data
 */
function getPokemon(id){
  return new Promise(function(resolve, reject){
    request(config.apiUrl + '/pokemon/' + id, function (error, response) {
      if (error) {
        reject(error);
      }
      else if (response.statusCode == 200) {
        var pokemonData = JSON.parse(response.body);
        resolve(pokemonData);
      }
    });
  });
}

/**
 * @name getPokemonAreaEncounters
 * @description Get the pokemon area encounters (from all the regions)
 * @param {string} url API Pokemon area encounters URL
 * @return {array} area_encounters The pokemon area encounters
 * @todo Filter the area encounters by region
 */
function getPokemonAreaEncounters(area_encounters_url) {
  area_encounters_url = area_encounters_url.replace('/api/v2', ''); // Remove the api version
  var pokemonAreaEncounters;
  var area_encounters = [];
  return new Promise(function(resolve, reject) {
    request(config.apiUrl + area_encounters_url, function(error, response) {
      if (error) {
        reject(error);
      }
      else if (response.statusCode == 200) {
        pokemonAreaEncounters = JSON.parse(response.body);
        if (pokemonAreaEncounters.length >= 1) {
          var countAreas = pokemonAreaEncounters.length;
          for (var i = 0; i <= countAreas; i++) {
            if (i === countAreas) {
              resolve(area_encounters);
              break;
            }
            area_encounters.push(pokemonAreaEncounters[i].location_area.name);
          }
        }
        resolve(pokemonAreaEncounters);
      }
    });
  });
}

/**
 * @name getPokemonEvolutions
 * @description Get the pokemon evolutions
 * @param {integer} id The pokemon ID
 * @return {object} evolutions The pokemon evolutions
 */
function getPokemonEvolutions(id){
  var evolutions = [];
  return new Promise(function(resolve, reject){
    request(config.apiUrl + '/pokemon-species/' + id, function(error, response){
      var pokemonSpeciment = JSON.parse(response.body);
      var evolution_chain_url = pokemonSpeciment.evolution_chain.url;
      request(evolution_chain_url, function(error, response){
        if (error) {
          reject(error);
        }
        else if (response.statusCode == 200) {
          var pokemonEvolutions = JSON.parse(response.body);
          var currentEvolution = pokemonEvolutions.chain.evolves_to.pop();
          while (true) {
            if (typeof currentEvolution == 'undefined') {
              resolve(evolutions);
              break;
            }
            evolutions.push({
              id   : currentEvolution.species.url.split('/')[6], // pokemon id extracted from the URL;
              name : currentEvolution.species.name
            });
            currentEvolution = currentEvolution.evolves_to.pop();
          }
        }
      });
    });
  });
}

/**
 * @name fillPokedex
 * @description Recursive function that stores the pokemon information
 * @param {integer} index The actual pokemon ID (incremented by the function)
 * @param {object} pokedex Pokedex data
 * @param {function} callback callback function
 * @return {object} pokedex The complete pokedex
 */
function fillPokedex(index, pokedex, callback){
  getPokemon(index).then(function(pokemon) {
    var pkEntry = padNumber(pokemon.id, config.pad);
    var pkImage = pokemon.sprites.front_default;

    base64.encode(pkImage, {string : true, local : false}, function(error, base64Img) {
      pokedex[pkEntry] = {
        id         : pokemon.id,
        name       : pokemon.name,
        image      : base64Img,
        order      : pokemon.order,
        abilities  : pokemon.abilities,
        stats      : pokemon.stats,
        types      : pokemon.types,
        weight     : pokemon.weight,
        height     : pokemon.height,
        region     : "Kanto",
        evolutions : []
      };
      getPokemonAreaEncounters(pokemon.location_area_encounters).then(function(area_encounters) {
        pokedex[pkEntry].locations = area_encounters;
        getPokemonEvolutions(pokemon.id).then(function(evolutions) {
          pokedex[pkEntry].evolutions = evolutions;
          bar.tick();
          if (index == config.max) {
            callback(pokedex);
          } else {
            index++;
            fillPokedex(index, pokedex, callback);
          }
        });
      });
    });
  })
  .catch(function(error){
    console.log(error);
  });
}

/**
 * Main function
 */
(function() {
  var pokedex = {};
  fillPokedex(config.min, pokedex, function(pokedex){
    fs.writeFile(config.filePath, JSON.stringify(pokedex), function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("\n The pokedex file was saved on: " + config.filePath + '\n');
    });
  });
})();
