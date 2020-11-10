import React from 'react';
import { useParams } from 'react-router-dom';
import { withRouter } from "react-router";

class Protein extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            protein: null
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        fetch(`http://localhost:2000/protein/${id}`)
            .then(res => res.json())
            .then(res => {
                console.log('first')
                if (res.length > 0) {
                    this.setState({
                        protein: res[0]
                    })
                }
            })
            .catch(err => {
                this.setState({ error: err });
                console.log(err)
            });
        console.log('second')
    }

    render() {
        console.log('Protein')

        if (this.state.error) {
            console.log(this.state.error)
            return <div>Error</div>

        }

        if (this.state.protein) {
            return (
                <div>
                    <div>
                        Name: {this.state.protein.name}
                    </div>
                </div>
            )
        }

        return <div>loading...</div>
    }
}

export default withRouter(Protein);