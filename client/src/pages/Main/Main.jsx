import React, { useEffect } from "react";
import { fetchUsers, updateCardsStore } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { getCards } from "../../store/selectors";
import "./style.scss";
import AppRoutes from "../../routes/AppRoutes";
import Header from "../../components/Header/Header";
import NoFriendsCards from "../../components/NoFriendsCards/NoFriendsCards";
import FriendsCards from "../../components/FriendsCards/FriendsCards";
import { Redirect, Route, Switch } from "react-router-dom";
import PagesUser from "../PageUser/PageUser";
import Page404 from "../../components/Page404/Page404";
import Direct from "../../components/Direct/Direct";
import Explore from "../../components/Explore/Explore";
import Heart from "../../components/Heart/Heart";

const Main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const cards = useSelector(getCards);

  const favoriteLocalStorage = (_id) => {
    let array = JSON.parse(localStorage.getItem("favorites")) || [];
    array = array.includes(_id)
      ? array.filter((el) => el !== _id)
      : array.concat(_id);
    const favorites = JSON.stringify(array);
    localStorage.setItem("favorites", favorites);
  };

  const toggleFavorite = (_id) => {
    const newArray = cards.map((el) => {
      if (el._id === _id) {
        el.isInfavorite = !el.isInfavorite;
      }
      return el;
    });
    favoriteLocalStorage(_id);
    dispatch(updateCardsStore(newArray));
  };

  const addedLocalStorage = (_id) => {
    let array = JSON.parse(localStorage.getItem("added")) || [];
    array = array.includes(_id)
      ? array.filter((el) => el !== _id)
      : array.concat(_id);
    const added = JSON.stringify(array);
    localStorage.setItem("added", added);
  };

  const toggleAdded = (_id) => {
    const newArray = cards.map((el) => {
      if (el._id === _id) {
        el.added = !el.added;
      }
      return el;
    });

    addedLocalStorage(_id);
    dispatch(updateCardsStore(newArray));
  };
  const toggleIsOpenModal = (_id, e) => {
    const newArray = cards.map((el) => {
      if (el._id === _id) {
        el.isOpenModal = !el.isOpenModal;
      }
      return el;
    });
    dispatch(updateCardsStore(newArray));
  };

  return (
    <>
      <Switch>
        <Redirect exact from="/" to="home" />
        <Route
          exact
          path="/home"
          render={(routerProps) => (
            <>
              <Header />
              <div className="container-main">
                <div className="left">
                  <AppRoutes
                    toggleAdded={toggleAdded}
                    toggleFavorite={toggleFavorite}
                    cards={cards}
                  />
                </div>
                <div className="right">
                  <div className="firstFrendsWindow">
                    <FriendsCards
                      cards={cards}
                      toggleAdded={toggleAdded}
                      toggleFavorite={toggleFavorite}
                    />
                  </div>
                  <div className="twoFrendsWindow">
                    <NoFriendsCards
                      cards={cards}
                      toggleAdded={toggleAdded}
                      toggleFavorite={toggleFavorite}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        />
        <Route
          exact
          path="/:userId"
          render={(routerProps) => (
            <PagesUser
              toggleIsOpenModal={toggleIsOpenModal}
              toggleAdded={toggleAdded}
              toggleFavorite={toggleFavorite}
              {...routerProps}
            />
          )}
        />
        <Route
          exact
          path="/direct/inbox"
          render={() => (
            <div className="box-direct">
              <Header />
              <Direct cards={cards} />
            </div>
          )}
        />
        <Route
          exact
          path="/explore"
          render={() => (
            <>
              <Header />
              <Explore />
            </>
          )}
        />
        <Route
          exact
          path="/heart"
          render={() => (
            <>
              <Header />
              <Heart />
            </>
          )}
        />
    
      </Switch>
    </>
  );
};

export default Main;
