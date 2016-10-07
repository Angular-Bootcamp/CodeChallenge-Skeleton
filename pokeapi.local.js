'use strict';

const request = require('request');
const base64 = require('node-base64-image');
const fs = require('fs');
const ProgressBar = require('progress');

const config = {
  api: {
    url: 'http://pokeapi.co/api/v2'
  },
  min: 1,
  max: 10,
  pad: 3,
  filePath: './data/pokedex.json'
};

const bar = new ProgressBar('  populating pokedex [:bar] :percent :etas', { total: config.max, complete: '=', incomplete: ' ', width: 80 });

/**
 * Pad a number with leading zeros to "pad" places:
 *
 * @param {number} number The number to pad
 * @param {string} pad The maximum number of leading zeros
 */
function padNumber(number, pad) {
    var N = Math.pow(10, pad);
    return number < N ? ("" + (N + number)).slice(1) : "" + number
}

/**
 * Get the pokemon base information
 *
 * @param {integer} id The pokemon ID
 * @return {object} pokemon The pokemon information
 */
function getPokemon(id){
  return new Promise(function(resolve, reject){
    request(config.api.url + '/pokemon/' + id, function (error, response) {
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

function getPokemonAreaEncounters(area_encounters_url) {
  area_encounters_url = area_encounters_url.replace('/api/v2', '');
  var pokemonAreaEncounters;
  var area_encounters = [];
  return new Promise(function(resolve, reject) {
    request(config.api.url + area_encounters_url, function(error, response) {
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
            }
            else {
              area_encounters.push(pokemonAreaEncounters[i].location_area.name);
            }
          }
        }
        else {
          resolve(pokemonAreaEncounters);
        }
      }
    });
  });
}

function getPokemonEvolutions(id){
  var evolutions = [];
  return new Promise(function(resolve, reject){
    request(config.api.url + '/pokemon-species/' + id, function(error, response){
      var pokemonSpeciment = JSON.parse(response.body);
      var evolution_chain_url = pokemonSpeciment.evolution_chain.url;
      request(evolution_chain_url, function(error, response){
        if (error) {
          reject(error)
        }
        else if (response.statusCode == 200) {
          var pokemonEvolutions = JSON.parse(response.body);
          var currentEvolution = pokemonEvolutions.chain.evolves_to.pop();
          while (true) {
            if (typeof currentEvolution == 'undefined') {
              return resolve(evolutions);
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

function fillPokedex(index, pokedex, callback){
  getPokemon(index).then(function(pokemon) {
    var pkEntry = padNumber(pokemon.id, config.pad);
    var pkImage = pokemon.sprites.front_default;

    base64.encode(pkImage, {string : true, local : false}, function(error, base64Img) {
      pokedex[pkEntry] = {
        id         : pokemon.id, // _id field must contain a string
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
  });
}

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
