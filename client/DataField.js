import React from "react";
import CSS from "./Protein.css";

const DataField = (props) => {
  const { editMode, name, content, onUpdateContent, onEdit } = props;
  let renderContent = null;
  let button = null;

  if (editMode) {
    renderContent = (
      <textarea
        id={`content-text-${name.toLowerCase()}`}
        rows={6}
        cols={67}
        defaultValue={content}
      />
    );
    button = (
      <div className="edit-button" onClick={() => onUpdateContent()}>
        Save
      </div>
    );
  } else {
    renderContent = <div className="content-container">{content}</div>;
    button = (
      <div
        className="edit-button "
        onClick={() => {
          onEdit(name.toLowerCase());
        }}
      >
        Edit
      </div>
    );
  }
  return (
    <div>
      <div className="content-label">{name}</div>
      {renderContent}
      {button}
    </div>
  );
};

export default DataField;
