import React, {Component} from 'react';
import axios from 'axios'

class Fib extends Component {
    state = {
        indices: [1, 2, 3],
        values: {
            "1": 1,
            "3": 5,
            "7": 21
        },
        index: null
    };

    componentDidMount() {
        this.fetchIndices();
        this.fetchValues();
    }

    fetchIndices = () => {
        axios.get('/indices')
            .then(res => {
                this.setState({
                    indices: res.data
                })
            })
            .catch(error => {
                console.log(error)
            })
    };

    fetchValues = () => {
        axios.get('/values')
            .then(res => {
                this.setState({
                    values: res.data
                })
            })
            .catch(error => {
                console.log(error)
            })
    };

    indexChangeHandler = (event) => {
        this.setState({
            index: event.target.value
        })
    };

    submitHandler = () => {
      axios.post('/indices/' + this.state.index)
          .then(res => console.log(res))
          .catch(err => console.log(err))
    };

    render() {
        const values = [];
        if (this.state.values) {
            for (const key in this.state.values) {
                values.push(<p key={key}>For index {key} i found {this.state.values[key]}</p>)
            }
        }

        let indices = null;
        if (this.state.indices) {
            indices = this.state.indices.join(', ');
        }
        return (
            <div>
                <form>
                    <input placeholder="Enter the index"
                           value={this.state.index}
                           onChange={this.indexChangeHandler}/>
                    <button onClick={this.submitHandler}>Submit</button>
                </form>
                <h3>Indices i have seen</h3>
                {values}
                <h3>Values I have for</h3>
                {indices}
            </div>
        )
    }
}

export default Fib;

