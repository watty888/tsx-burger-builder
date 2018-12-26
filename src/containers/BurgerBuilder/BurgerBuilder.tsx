import * as React from 'react';
import { BuildControls } from '../../components/Burger/BuildControls/BuildControls';
import { Burger } from '../../components/Burger/Burger';
import { OrderSummary } from '../../components/Burger/OrderSummary';
import { Modal } from '../../components/UI/Modal/Modal';
import { Aux } from '../../hoc';

export interface IngredientTypes {
  bacon: number;
  cheese: number;
  meat: number;
  salad: number;
  [index: string]: any;
}

export interface IBurgerBuilderProps {}

export interface IBurgerBuilderState {
  ingredients: IngredientTypes;
  purchasable: boolean;
  purchasing: boolean;
  totalPrice: number;
  [index: string]: any;
}

const INGREDIENT_PRICES: IngredientTypes = {
  bacon: 0.7,
  cheese: 0.4,
  meat: 1.3,
  salad: 0.5,
};

export class BurgerBuilder extends React.Component<IBurgerBuilderProps, IBurgerBuilderState> {
  public state = {
    ingredients: {
      bacon: 0,
      cheese: 0,
      meat: 0,
      salad: 0,
    } as IngredientTypes,
    purchasable: false,
    purchasing: false,
    totalPrice: 4,
  };

  private purchaceContinueHandler = () => {
    alert('You Continue!');
  }

  private purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  }

  private purchaseHandler = (): void => {
    this.setState({ purchasing: true });
  }

  private updatePurchaseState = (ingredients: IngredientTypes) => {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      },      0);
    this.setState({ purchasable: sum > 0 });
  }

  private addIngredientHandler = (type: string) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = { ...this.state.ingredients };

    updatedIngredients[type] = updatedCount;

    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  }

  private removeIngredientHandler = (type: string) => {
    if (this.state.ingredients[type] === 0) {
      return;
    } else {
      const oldCount = this.state.ingredients[type];
      const updatedCount = oldCount - 1;
      const updatedIngredients = { ...this.state.ingredients };

      updatedIngredients[type] = updatedCount;

      const priceAddition  = INGREDIENT_PRICES[type];
      const oldPrice = this.state.totalPrice;
      const newPrice = oldPrice - priceAddition;

      this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
      this.updatePurchaseState(updatedIngredients);
    }
  }

  public render(): JSX.Element {
    const disabledInfo: IngredientTypes = { ...this.state.ingredients };
    for (const key in disabledInfo) {
      if (disabledInfo[key] <= 0) {
        disabledInfo[key] = true;
      }
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          <OrderSummary
            ingredients={this.state.ingredients}
            purchaseCandelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaceContinueHandler}
            price={this.state.totalPrice}
          />
        </Modal>
        <Burger ingredients={this.state.ingredients}/>
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          price={this.state.totalPrice}
          disabled={disabledInfo}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler}
        />
      </Aux>
    );
  }
}
