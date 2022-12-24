import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import BaseHeader from '../../components/common/BaseHeader';
import Navigation from '../../components/common/Navigation';
import leftArrowIcon from '../../assets/icon/icon-arrow-left.png';
import verticalIcon from '../../assets/icon/s-icon-more-vertical.png';
import UserInfo from '../../components/Profile/UserInfo';

import getProfileInfo from '../../api/profile';
import { getMyPost } from '../../api/post';

function Profile() {
  const param = useParams();
  const isMyPage = param.id === JSON.parse(localStorage.getItem('accountName'));

  const { data, isLoading, isError } = useQuery('profileInfo', () =>
    getProfileInfo(param.id)
  );

  if (!isLoading) {
    console.log(data.profile);
  }

  return (
    <>
      <BaseHeader
        leftIcon={leftArrowIcon}
        leftClick={() => {}}
        rightIcon={verticalIcon}
        rightAlt="프로필 설정"
        rightClick={() => {}}
      />
      {!isLoading && (
        <UserInfo
          followerCount={data.profile.followerCount}
          followingCount={data.profile.followingCount}
          profileImage={data.profile.image}
          userName={data.profile.username}
          accountName={data.profile.accountname}
          intro={data.profile.intro}
          isFollow={data.profile.isfollow}
          isMyPage={isMyPage}
        />
      )}

      <Navigation />
    </>
  );
}

export default Profile;
