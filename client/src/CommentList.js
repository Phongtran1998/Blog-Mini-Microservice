import React from 'react';

export default ({ comments }) => {
  const renderComments = comments.map((comment) => (
    <li key={comment.id}>{comment.content}</li>
  ));
  return <ul>{renderComments}</ul>;
};
