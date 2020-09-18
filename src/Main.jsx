import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Main = ({ plugin }) => {
  const [options, setOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(-1);

  const handleEdit = ({ target: { value } }, index, closeEdit = true) => {
    let tmp = [];
    // Delete
    if (!value && options.length > 1) {
      tmp = options.filter((_, i) => i !== index);
      setOptions(tmp);
    }
    // Change
    else {
      tmp = options.map((option, i) => i !== index ? option : value);
      setOptions(tmp);
    }
    plugin.setFieldValue(plugin.fieldPath, JSON.stringify(tmp));
    if (closeEdit) setIsEditing(-1);
  };

  const handleNext = (e, index) => {
    // Cannot add another with no value
    if (e.target.value === '') {
      return;
    }
    // add another
    else if (index + 1 === options.length) {
      options.push('');
      handleEdit(e, index, false);
    }
    // select next
    else {
      handleEdit(e, index, false);
    }
    setIsEditing(index + 1);
  };

  const handleKeyDown = (e, index) => {
    if(e.keyCode === 13) handleEdit(e, index);
    if(e.keyCode === 9) handleNext(e, index);
  };

  const setAnswersHelper = () => {
    const fieldValue = JSON.parse(plugin.getFieldValue(plugin.fieldPath) || []);
    setOptions(fieldValue.length ? fieldValue : ['']);
    if (!fieldValue.length) setIsEditing(0);
  };

  useEffect(() => {
    setAnswersHelper();
    return plugin.addFieldChangeListener(plugin.fieldPath, setAnswersHelper);
  }, []);

  useEffect(() => {
    if (isEditing === -1) return;
    const elem = window.document.querySelector('textarea');
    if (elem) elem.focus();
  }, [isEditing])

  return (
    <>
      <Wrapper>
        {options.map((option, index) => (
          <Item key={`opt_${index}`}>
            <Container
              onClick={() => isEditing !== index && setIsEditing(index)}
            >
              {isEditing === index ? <>
                <textarea
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >{option}</textarea>
              </> : option}
            </Container>
          </Item>
        ))}
      </Wrapper>
      <Help>
        <strong>Tab</strong> to go to next&nbsp;&nbsp;&nbsp;
        <strong>Enter</strong> to save option&nbsp;&nbsp;
        <strong>Enter with empty content</strong> to delete option
      </Help>
    </>
  );
};

Main.propTypes = {
  plugin: PropTypes.object.isRequired,
};

export default Main;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: -10px;
  margin-left: -10px;
  width: calc(100% + 20px);
  margin-bottom: 10px;
`;

const Item = styled.div`
  width: calc(50% - 20px);
  padding: 10px 10px 0 10px;
`;

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  text-align: center;
  background: #f4f4f4;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  padding: 10px;
  &:hover {
    cursor: pointer;
    background: #f7f7f7;
  }
`;

const Help = styled.div`
  padding-top: 10px;
  font-size: 10px;
  padding-left: 5px;
  color: #666;
`;
