import React, { useState } from 'react';
import styled from 'styled-components';

import basicProfilSmallImg from '../../../assets/basic-profile_small.png';
import { IR } from '../../../styles/Util';

const SContents = styled.section`
  position: sticky;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.6rem;
  background-color: ${({ theme }) => theme.color.WHITE};
  border-top: 0.05rem solid ${({ theme }) => theme.color.LIGHT_GRAY};
`;

const STitle = styled.h2`
  ${IR}
`;

const SProfileImg = styled.img`
  width: 3.6rem;
  border-radius: ${({ theme }) => theme.borderRadius.ROUND};
`;

const SLabel = styled.label`
  ${IR}
`;

const SInputForm = styled.input`
  width: 100%;
  margin: 0 1.8rem;
  border-style: none;
  &::placeholder {
    color: ${({ theme }) => theme.color.LIGHT_GRAY};
  }
`;

const SButton = styled.button`
  width: 2.5rem;
  font-size: ${({ theme }) => theme.fontSize.MEDIUM};
  white-space: nowrap;
  color: ${({ theme }) => theme.color.LIGHT_GRAY};
`;

function CommentInput({ id, onCreateCommentData }) {
  const [commentData, setCommentData] = useState({
    dataId: 'test',
    content: '',
    createdAt: '방금 전',
    author: {
      id: 'testId',
      username: 'test',
      accountname: 'test',
      intro: 'Hello world!',
      image: 'https://picsum.photos/250/250',
      isfollow: true,
    },
  });

  const handleCommentData = (e) => {
    setCommentData({
      ...commentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCommentSubmit = () => {
    if (commentData.content.length < 1) {
      alert('댓글을 입력해주세요.');
    } else {
      onCreateCommentData(
        commentData.dataId,
        commentData.content,
        commentData.createdAt,
        commentData.author
      );
      setCommentData({
        dataId: 'test',
        content: '',
        createdAt: '방금 전',
        author: {
          id: 'testId',
          username: 'test',
          accountname: 'test',
          intro: 'Hello world!',
          image: 'https://picsum.photos/250/250',
          isfollow: true,
        },
      });
    }
  };

  return (
    <SContents>
      <STitle>댓글 입력</STitle>
      <SProfileImg src={basicProfilSmallImg} alt="프로필 이미지" />
      <SLabel htmlFor={id} />
      <SInputForm
        id={id}
        placeholder="댓글 입력하기..."
        name="content"
        value={commentData.content}
        onChange={handleCommentData}
      />
      <SButton type="button" onClick={handleCommentSubmit}>
        게시
      </SButton>
    </SContents>
  );
}

export default CommentInput;
