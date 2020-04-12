import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from "react-router-dom";
import filterParams from '../../const/filterParams'
import './ads.css';

const { getAds, filterAd } = api();

export const listOfAds = async () => {
  const ads = await getAds();
  return ads;
}

let filteredAdsArray = [];

export default class Ads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adsList: [],
      filterInput: '',
      filterSelect: filterParams[0].id,
      filteredAdsList: null
    }
    this.fetchAds();
  }

  fetchAds = async () => {
    this.getAdsList();
  };

  getAdsList = async () => {
    const ads = await getAds();
    if (ads.error) {
      alert('No se ha encontrado la lista de anuncios');
      this.props.history.push('/login');
    } else {
      this.setState({
        adsList: ads.results
      })
      return ads.results;
    }

  };

  onType = event => {
    const value = event.target.value;
    if (value === 'buy') {
      this.setState({
        filterInput: false
      });
    } else if (value === 'sell') {
      this.setState({
        filterInput: true
      })
    } else {
      this.setState({
        filterInput: event.target.value
      });
    }

  };

  filterAds = async (query, value) => {
    const filteredAds = await filterAd(query, value);
    return filteredAds;
  };

  onSelect = event => {
    this.setState({
      filterSelect: event.target.value
    });
  };

  onSubmit = async event => {
    event.preventDefault();
    this.onResetFilter();
    const adsWithFilter = await this.filterAds(`${this.state.filterSelect}`, `${this.state.filterInput}`);
    if (adsWithFilter.error) {
      alert('Por favor ingrese un valor para filtrar.');
    } else {
      adsWithFilter.results.map(adFiltered => {
        filteredAdsArray.push(adFiltered);
      });
      this.setState({
        filteredAdsList: filteredAdsArray
      });
    }



  };

  onResetFilter = (event) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({
      filteredAdsList: null,
    });

    filteredAdsArray = [];
  };

  render() {
    this.fetchAds();
    const { adsList, filteredAdsList } = this.state;

    return (
      <div className="content-container">
        <Link to="/login" className="log-out-container">
          <button className="log-out">Log Out</button>
        </Link>
        <h1>General Ads</h1>
        <Link to="/createAd">
          <button className="create-ad">Create Ad</button>
        </Link>
        <form className="ads-form" onSubmit={this.onSubmit}>
          <select className="select-form" name="" id="" onChange={this.onSelect}>
            {filterParams.map(param => {
              return <option value={param.id}>{param.param}</option>
            })}
          </select>
          <input className="input-form" onChange={this.onType} type="text" />
          <button className="search-form" type="submit">Search</button>
          <button className="reset-form" onClick={this.onResetFilter}>Reset</button>
        </form>

        <ul>
          {filteredAdsList === null ? (
            adsList.map(ad => {
              return (
                <Link key={ad._id} to={`/anuncios/${ad._id}`}>
                  <li>
                    <img src={ad.photo} alt="AdImage" />
                    <br />
                    <h2>{ad.name}</h2>
                    <div className="price-type">
                      <p>Price: {ad.price}</p>
                      <p>Type: {ad.type}</p>
                    </div>
                    <p className="description">{ad.description}</p>
                    <Link to={`/editAd/id=${ad._id}`}>
                      <button className="edit-btn">Edit Ad</button>
                    </Link>
                  </li>
                </Link>
              )
            })
          ) : (
              filteredAdsList.map(ad => {
                return (
                  <Link to={`/detail/${ad._id}`}>
                    <li key={ad._id}>
                      <img src={ad.photo} alt="AdImage" />
                      <br />

                      <h2>{ad.name}</h2>
                      <div className="price-type">
                        <p>Price: {ad.price}</p>
                        <p>Type: {ad.type}</p>
                      </div>
                      <p>{ad.description}</p>
                      <Link to={`/editAd/id=${ad._id}`}>
                        <button className="edit-btn">Edit Ad</button>
                      </Link>
                    </li>
                  </Link>
                )
              })
            )
          }
        </ul>
      </div>
    )
  }
}
