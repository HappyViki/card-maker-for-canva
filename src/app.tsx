import * as React from "react";
import { Alert, Button, LoadingIndicator, Rows, Text } from "@canva/app-ui-kit";
import type { QueuedImage } from "@canva/asset";
import { upload } from "@canva/asset";
import { addNativeElement } from "@canva/design";
import styles from "styles/components.css";
import club from "../assets/images/club.png";
import diamond from "../assets/images/diamond.png";
import heart from "../assets/images/heart.png";
import spade from "../assets/images/spade.png";

const cardSize = {
  height: 88,
  width: 63,
};

const SUITS = {};

const uploadSuits = async () => {
  SUITS.CLUB = await upload({
    type: "IMAGE",
    mimeType: "image/png",
    url: club,
    thumbnailUrl: club,
  });
  SUITS.DIAMOND = await upload({
    type: "IMAGE",
    mimeType: "image/png",
    url: diamond,
    thumbnailUrl: diamond,
  });
  SUITS.HEART = await upload({
    type: "IMAGE",
    mimeType: "image/png",
    url: heart,
    thumbnailUrl: heart,
  });
  SUITS.SPADE = await upload({
    type: "IMAGE",
    mimeType: "image/png",
    url: spade,
    thumbnailUrl: spade,
  });

  await SUITS.CLUB.whenUploaded();
  await SUITS.DIAMOND.whenUploaded();
  await SUITS.HEART.whenUploaded();
  await SUITS.SPADE.whenUploaded();
};

const addCard = async (suit: QueuedImage, rank: string, left = 0, top = 0) => {
  const card = {
    type: "SHAPE",
    paths: [
      {
        d: `M 0 0 H ${cardSize.width} V ${cardSize.height} H 0 L 0 0`,
        fill: {
          dropTarget: true,
          color: "#ffffff",
        },
        stroke: {
          weight: 1,
          color: "#000000",
          strokeAlign: "inset",
        },
      },
    ],
    viewBox: {
      height: cardSize.height,
      width: cardSize.width,
      left: 0,
      top: 0,
    },
    height: cardSize.height,
    width: cardSize.width,
    left: 0,
    top: 0,
  };

  const middleMargin = 30;

  const middle = {
    type: "SHAPE",
    paths: [
      {
        d: `M 0 0 H ${cardSize.width - middleMargin} V ${
          cardSize.height - middleMargin
        } H 0 L 0 0`,
        fill: {
          dropTarget: true,
          color: "#ffffff",
        },
      },
    ],
    viewBox: {
      height: cardSize.height - middleMargin,
      width: cardSize.width - middleMargin,
      left: 0,
      top: 0,
    },
    height: cardSize.height - middleMargin,
    width: cardSize.width - middleMargin,
    left: middleMargin / 2,
    top: middleMargin / 2,
  };

  const topLeftCornerSuit = {
    type: "IMAGE",
    ref: suit.ref,
    height: 16,
    width: 16,
    left: 0,
    top: 0,
    rotation: 0,
  };

  const bottomRightCornerSuit = {
    ...topLeftCornerSuit,
    left: cardSize.width - topLeftCornerSuit.width - topLeftCornerSuit.left,
    top: cardSize.height - topLeftCornerSuit.height - topLeftCornerSuit.top,
    rotation: 180,
  };

  const topLeftCornerRank = {
    type: "TEXT",
    children: [rank],
    height: 16,
    width: 16,
    left: 3,
    top: 14,
    rotation: 0,
  };

  const bottomRightCornerRank = {
    ...topLeftCornerRank,
    left: cardSize.width - topLeftCornerRank.width - topLeftCornerRank.left,
    top: cardSize.height - topLeftCornerRank.height - topLeftCornerRank.top - 3,
    rotation: 180,
  };

  await addNativeElement({
    type: "GROUP",
    children: [
      card,
      middle,
      topLeftCornerSuit,
      bottomRightCornerSuit,
      topLeftCornerRank,
      bottomRightCornerRank,
    ],
    height: cardSize.height,
    width: cardSize.width,
    left,
    top,
  });
};

const addAllCards = async () => {
  const RANKS = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "X",
    "J",
    "Q",
    "K",
  ];

  for (let i = 0; i < RANKS.length; i++) {
    await addCard(
      SUITS.CLUB,
      RANKS[i],
      cardSize.width * i,
      cardSize.height * 0
    );
  }
  for (let i = 0; i < RANKS.length; i++) {
    await addCard(
      SUITS.DIAMOND,
      RANKS[i],
      cardSize.width * i,
      cardSize.height * 1
    );
  }
  for (let i = 0; i < RANKS.length; i++) {
    await addCard(
      SUITS.HEART,
      RANKS[i],
      cardSize.width * i,
      cardSize.height * 2
    );
  }
  for (let i = 0; i < RANKS.length; i++) {
    await addCard(
      SUITS.SPADE,
      RANKS[i],
      cardSize.width * i,
      cardSize.height * 3
    );
  }
};

export const App = () => {
  const [isReady, setReady] = React.useState<boolean>(false);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const render = async () => {
    setLoading(true);
    await uploadSuits();
    await addAllCards();
    setLoading(false);
    setReady(true);
  };

  return (
    <div className={styles.scrollContainer}>
      {!isReady ? (
        <Rows spacing="2u">
          <Alert tone="warn">
            <Text>
              This app will upload 4 suit images and add 52 playing cards to
              your design.
            </Text>
          </Alert>
          <Button variant="primary" onClick={render} stretch>
            {isLoading ? <LoadingIndicator size="large" /> : "Okay, I'm ready!"}
          </Button>
        </Rows>
      ) : (
        <Rows spacing="2u">
          <Alert tone="positive">
            <Text>Start designing!</Text>
          </Alert>
        </Rows>
      )}
    </div>
  );
};
