import React from 'react';
import { Link } from 'react-router-dom';

class FrontPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proteins: []
        }
        this.updateProteinName = this.updateProteinName.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    updateProteinName(name) {
        this.setState({
            newProteinName: name
        })
    }

    onFormSubmit(event) {
        event.preventDefault();
        console.log(this.state.newProteinName)
        fetch('http://localhost:2000/protein', {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ proteinName: this.state.newProteinName })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({ newProteinName: '' });
                this.updateList();
            })
            .catch(err => { console.log(err) });
    }


    updateList() {
        fetch('http://localhost:2000/protein')
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.setState({
                    proteins: res
                });
            })
            .catch(err => {
                this.setState({ error: err });
                console.log(err)
            });
    }

    componentDidMount() {
        this.updateList()
    }

    render() {
        return (
            <div>
                FrontPage
                <ProteinCreator
                    onFormSubmit={(ev) => { this.onFormSubmit(ev) }}
                    updateProteinName={(ev) => { this.updateProteinName(ev.target.value) }}
                    newProteinName={this.state.newProteinName}
                />
                <ProteinList proteins={this.state.proteins} />
            </div>
        )
    }
}

const ProteinList = ({ proteins }) => {
    console.log(proteins);
    return (
        <div className="ui celled list">
            {proteins.map(protein => (
                <div className="item">
                    <Link
                        className="content"
                        to={`/protein/${protein.name}`}
                        key={protein.name}
                    >
                        <div>
                            {protein.name}
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}


const ProteinCreator = (props) => {
    return (
        <div className="ui segment">
            <form onSubmit={props.onFormSubmit} className="ui form">
                <input
                    id="protein-name"
                    onChange={props.updateProteinName}
                    value={props.newProteinName}
                />
                <input
                    type="Submit"
                />
            </form>
        </div>
    )
}

export default FrontPage;