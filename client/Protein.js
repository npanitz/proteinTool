import React from "react";
import { useParams, Link } from "react-router-dom";
import { withRouter } from "react-router";
import DataField from "./DataField";
import CSS from "./Protein.css";
import { json } from "body-parser";
import util from "./util";

class Protein extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      protein: null,
      editing: {
        description: false,
        diseases: false,
        papers: false,
      },
      content: ["Description", "Diseases", "Papers"],
    };
    this.toggleEditor = this.toggleEditor.bind(this);
    this.onUpdateContent = this.onUpdateContent.bind(this);
    this.getProtein = this.getProtein.bind(this);
  }

  onUpdateContent(name) {
    const id = this.state.protein.name.toLowerCase();
    const content = document.getElementById(
      `content-text-${name.toLowerCase()}`
    ).value;

    fetch("http://localhost:2000/protein/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        update: { [name.toLowerCase()]: content },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.getProtein();
        this.toggleEditor(name.toLowerCase());
      });
  }
  toggleEditor(name) {
    this.setState({
      editing: { ...this.state.editing, [name]: !this.state.editing[name] },
    });
  }

  componentDidMount() {
    this.getProtein();
  }
  getProtein() {
    const id = this.props.match.params.id;
    fetch(`http://localhost:2000/protein/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.length > 0) {
          this.setState({
            protein: res[0],
          });
        }
      })
      .catch((err) => {
        this.setState({ error: err });
        console.log(err);
      });
  }

  render() {
    console.log("Protein");

    if (this.state.error) {
      console.log(this.state.error);
      return <div>Error</div>;
    }

    if (this.state.protein) {
      return (
        <div className="main-container">
          <div>
            <div className="title">
              {util.firstLetterUpperCase(this.state.protein.name)}
            </div>
            <Link to="/">
              <div className="back-button">Home</div>
            </Link>
            {this.state.content.map((name) => (
              <div className="content-section">
                <DataField
                  editMode={this.state.editing[name.toLowerCase()]}
                  name={name}
                  content={this.state.protein[name.toLowerCase()]}
                  onUpdateContent={() => {
                    this.onUpdateContent(name);
                  }}
                  onEdit={() => this.toggleEditor(name.toLowerCase())}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <div>loading...</div>;
  }
}

export default withRouter(Protein);
