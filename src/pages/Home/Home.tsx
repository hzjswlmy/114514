// @ts-nocheck

import React, {useCallback, useEffect, useState} from 'react';

import ParticleEffectButton from 'react-particle-effect-button'
import {useHistory} from 'react-router-dom';

import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

import {Button, Container, PhotoGrid, Spacing, Text, Title,} from '../../components';

const AV = window.AV

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [gallery, setGallery] = useState({});
  const [ButtonState, setButtonState] = useState({
    hidden: false,
    animating: false
  });
  const [photoNodeList, setPhotoNodeList] = useState([]);


  useEffect(() => {
    const query = new AV.Query('Photos');
    query.find().then((items) => {
      let _items = items.map(v=> ({
        src: v.attributes.url+'?x-oss-process=style/normal',
        'data-src': v.attributes.url+'?x-oss-process=style/webp',
        // thumbnail: v.attributes.url+'?x-oss-process=style/thum',
      }))
      setPhotos(_items)
      setGallery(new Viewer(document.querySelector('.my-masonry-grid', {
        url: 'data-src'
      })))
      const allImgNodeList = document.querySelectorAll('.my-masonry-grid img')
      setPhotoNodeList(allImgNodeList)

    });
  }, [])

  const onPhotoPress = useCallback((url) => {
    let targetIndex = 0
    photoNodeList.forEach((v,index)=> {
      if (v.src === url) {
        targetIndex = index
      }
    })
    gallery.show(targetIndex)
  }, [photos, gallery]);

  const onCommentClick = useCallback(() => {
    setButtonState({
      hidden: !ButtonState.hidden,
    });
  }, []);


  const onAnimationComplete = useCallback(() => {
    history.push('talk')
  }, []);

  const history = useHistory()
  const goUploadPage = () => {
    history.push('upload')
  }

  const buttonOptions = {
    type: 'triangle',
    easing: 'easeOutQuart',
    size: 6,
    particlesAmountCoefficient: 4,
    oscillationCoefficient: 2
  }

  return (
    <>
      <Container id="start" className="container intro">
        <Title level={1}>4??????????????????</Title>
        <Text inherit>?????????4???.</Text>
        <Container className="actions">
          <Spacing right={2}>
            <Button
              onPress={goUploadPage}
              className="mt-4 mb-6"
              primary
              large
            >
              ?????????????????????
              </Button>
          </Spacing>
          <Spacing left={2}>
            <ParticleEffectButton
              hidden={ButtonState.hidden}
              color='#fa709a'
              duration="500"
              onComplete={onAnimationComplete}
              {...buttonOptions}
            >
              <button
                className="particle-effect-button mt-4 mb-6
                button button__default button__large button__primary button__comment"
                onClick={onCommentClick}
              >
                ????????????
              </button>
            </ParticleEffectButton>
          </Spacing>
        </Container>
      </Container>
      <PhotoGrid onPhotoPress={onPhotoPress} photos={photos} />
    </>
  );
};

export default Home;
