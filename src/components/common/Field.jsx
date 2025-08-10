import React from "react";

export default function Field({ children, label, htmlFor, error }) {
  const getChildId = () => {
    const child = React.Children.only(children);
    if ("id" in child.props) {
      return child.props.id;
    }
  };

  const id = htmlFor || getChildId(children);
  return (
    <div className="mb-3">
      {label && (
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="relative">{children}</div>

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
