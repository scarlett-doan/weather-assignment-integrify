import React, {Component} from 'react';

import {MoonLoader} from 'react-spinners';

import classes from './App.module.css';
import Card from '../../elements/Card/Card';
import SearchBar from '../../components/SearchBar/SearchBar';
import WeatherDetails from '../../components/WeatherDetails/WeatherDetails';
import Preview from '../../components/Preview/Preview';
import ErrorNotice from '../../components/ErrorNotice/ErrorNotice';

// My private api key for ACCUWEATHER
const API_KEY = "BqC2OwBF6pbZGHCuZrB3CaZYl3Q538Nc"

class App extends Component {

    state = {
        searchBarInput: '', weatherDetails: {
            temperature: null, description: '',
            icon:''
        }, loading: false, error: false
    }

    searchBarHandler = (e) => {
        this.setState({
            searchBarInput: e.target.value
        })
    }

    tryAgainHandler = () => {
        this.setState({
            searchBarInput: '', weatherDetails: {}, error: false
        })
    }

    setWeather = () => {
        const city = this.state.searchBarInput;
        const LOCATION_URL = 'http://dataservice.accuweather.com/locations/v1/cities/search';
        const WEATHER_URL = 'http://dataservice.accuweather.com/currentconditions/v1/';
        const URL = LOCATION_URL + `?q=${city}&apikey=${API_KEY}`;
        this.setState({
            loading: true, error: false
        }, () => {
            fetch(URL)
                .then(res => res.json())
                .then(async data => {
                    // If city exists, update weather details
                    if (data.length > 0) {
                        await fetch(WEATHER_URL + data[0].Key + `?apikey=${API_KEY}`)
                            .then(res => res.json())
                            .then(data => {
                                    this.setState({
                                        weatherDetails: {
                                            temperature: data[0].Temperature.Metric.Value,
                                            description: data[0].HasPrecipitation === true ? data[0].PrecipitationType : data[0].WeatherText
                                        }, loading: false,
                                        error: false
                                    });
                                }
                            )
                    } else {
                        this.setState({
                            loading: false, error: true
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        loading: false, error: true
                    });
                });
        });
    }

    render() {
        let cardContent = <Preview/>;
        if (this.state.loading) {
            cardContent = <MoonLoader/>;
        } else if (this.state.error) {
            cardContent = <ErrorNotice onClickHandler={this.tryAgainHandler}/>;
        } else if (this.state.weatherDetails.temperature && this.state.weatherDetails.description !== '') {
            cardContent = <WeatherDetails data={this.state.weatherDetails}/>;
        }

        return (<div className={classes.AppWrapper}>
            <main className={classes.AppMain}>
                <SearchBar
                    value={this.state.searchBarInput}
                    onChangeHandler={this.searchBarHandler}
                    onClickHandler={this.setWeather}
                    error={this.state.error}/>
                <Card>
                    {cardContent}
                </Card>
            </main>
        </div>);
    }
}

export default App;
