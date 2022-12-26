import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

import * as S from './index.styles';
import verticalIcon from '../../../assets/icon/s-icon-more-vertical.png';
import heartIcon from '../../../assets/icon/icon-heart.png';
import filledHeartIcon from '../../../assets/icon/icon-heart-fill.png';
import commentIcon from '../../../assets/icon/icon-message-circle.png';
import BottomSheet from '../../Modal/BottomSheet';
import BottomSheetContent from '../../Modal/BottomSheet/BottomSheetContent';
import Dialog from '../../Modal/Dialog';
import TagItem from '../TagItem';

import { deleteMyPost, reportFollowPost } from '../../../api/post';
import { deleteLikeFeed, postLikeFeed } from '../../../api/like';
import Snackbar from '../../Modal/SnackBar';

function PostItem({
  postId,
  content,
  image,
  createdAt,
  hearted,
  heartCount,
  commentCount,
  author,
  goPostDetailPage,
  detail,
}) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetTrigger, setBottomSheetTrigger] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [tagArray, setTagArray] = useState([]);
  const [contents, setContents] = useState('');
  const [images, setImages] = useState([]);
  const [accountName, setAccountName] = useState('');
  const [dialogType, setDialogType] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const navigate = useNavigate();

  const deletePost = useMutation(() => deleteMyPost(postId));
  const postLike = useMutation(() => postLikeFeed(postId));
  const deleteLike = useMutation(() => deleteLikeFeed(postId));
  const reportPost = useMutation(() => reportFollowPost(postId));

  const handleLike = (e) => {
    e.stopPropagation();
    console.log(hearted);
    if (hearted) {
      deleteLike.mutate();
    } else {
      postLike.mutate();
    }
  };

  const handleBottomSheetOpen = (e) => {
    e.stopPropagation();
    setBottomSheetTrigger(!bottomSheetTrigger);

    if (bottomSheetTrigger) {
      setTimeout(() => {
        setIsBottomSheetOpen(false);
        setBottomSheetTrigger(false);
      }, 500);
    }

    setIsBottomSheetOpen(true);
  };

  const handleDialogOpen = (e) => {
    if (isDialogOpen) {
      setIsDialogOpen(false);
      setDialogType('');
    } else {
      setIsDialogOpen(true);
      setDialogType(e.target.textContent);
    }
  };

  const handleSnackBar = () => {
    setIsSnackBarOpen(true);
    return setTimeout(() => setIsSnackBarOpen(false), 2000);
  };

  const handleDialogAction = () => {
    if (dialogType === '삭제하기') {
      deletePost.mutate();
    } else if (dialogType === '신고하기') {
      reportPost.mutate();
      handleSnackBar();
    }

    setBottomSheetTrigger(!bottomSheetTrigger);
    setIsBottomSheetOpen(!isBottomSheetOpen);
    setIsDialogOpen(!isDialogOpen);
  };

  useEffect(() => {
    if (dialogType === '삭제하기') {
      setDialogMessage('정말 삭제하시겠습니까?');
    } else if (dialogType === '신고하기') {
      setDialogMessage('정말 신고하시겠습니까?');
    }
  }, [dialogType]);

  useEffect(() => {
    const jsonContents = JSON.parse(content);

    setTagArray(jsonContents.tags);
    setContents(jsonContents.content);
    setImages(image.split(', '));
    setAccountName(JSON.parse(localStorage.getItem('accountName')));
  }, []);

  const goToEditPage = () => {
    navigate(`/post/edit/${postId}`, {
      state: {
        postId,
        editTagArray: tagArray,
        editContent: contents,
        editImages: images,
      },
    });
  };

  const settings = {
    dots: true,
    speed: 1000,
  };

  return (
    <>
      <S.PostItem
        detail={detail}
        onClick={() => (detail ? null : goPostDetailPage(postId))}
      >
        <S.UserInfoContainer>
          <img src={author.image} alt="프로필 이미지" />
          <S.TextBox>
            <S.UserName>{author.username}</S.UserName>
            <S.AccountName>@{author.accountname}</S.AccountName>
          </S.TextBox>
        </S.UserInfoContainer>
        <S.Contents detail={detail}>
          <S.TagList>
            {tagArray.map((tag) => (
              <TagItem key={nanoid()} tagText={tag.text} tagColor={tag.color} />
            ))}
          </S.TagList>
          {contents}
        </S.Contents>
        {image && (
          <S.StyledSlider {...settings}>
            {images.map((src) => (
              <S.Image
                key={nanoid()}
                src={`https://mandarin.api.weniv.co.kr/${src}`}
                alt="img"
              />
            ))}
          </S.StyledSlider>
        )}
        <S.BottomContainer>
          <S.IConContainer>
            <S.Icon>
              <button type="button" onClick={handleLike}>
                <img
                  src={hearted ? filledHeartIcon : heartIcon}
                  alt="좋아요 수"
                />
              </button>
              {heartCount}
            </S.Icon>
            <S.Icon>
              <img src={commentIcon} alt="댓글 수" />
              {commentCount}
            </S.Icon>
          </S.IConContainer>
          <S.Date>{createdAt.slice(0, 10)}</S.Date>
        </S.BottomContainer>
        {!detail && (
          <S.VerticalButton onClick={handleBottomSheetOpen}>
            <img src={verticalIcon} alt="포스트 설정 버튼" />
          </S.VerticalButton>
        )}
      </S.PostItem>
      {isBottomSheetOpen && author.accountname === accountName && (
        <BottomSheet
          handleClose={handleBottomSheetOpen}
          bottomSheetTrigger={bottomSheetTrigger}
        >
          <BottomSheetContent
            text="게시글 삭제하기"
            onClick={handleDialogOpen}
          />
          <BottomSheetContent text="게시글 수정하기" onClick={goToEditPage} />
        </BottomSheet>
      )}
      {isBottomSheetOpen && author.accountname !== accountName && (
        <BottomSheet
          handleClose={handleBottomSheetOpen}
          bottomSheetTrigger={bottomSheetTrigger}
        >
          <BottomSheetContent
            text="게시글 신고하기"
            onClick={handleDialogOpen}
          />
        </BottomSheet>
      )}
      {isDialogOpen && (
        <Dialog
          dialogText={dialogMessage}
          handleClose={handleDialogOpen}
          handleSubmit={handleDialogAction}
        />
      )}
      {isSnackBarOpen && <Snackbar content="신고가 접수되었습니다." />}
    </>
  );
}

export default PostItem;
