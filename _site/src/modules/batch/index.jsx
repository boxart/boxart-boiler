import 'core-js/modules/es6.object.assign';

import React, {Children} from 'react';

import Component from '../update-ancestor';

/**
 * Batch
 *
 * Common and useful optimization over a batch of elements reducing
 * object creation.
 *
 * Make sure to localize all data an item under this component needs to be
 * represented is in its member of the passed array. As long as that is true
 * this optimization won't get in the way.
 */
export default class Batch extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      items: this.props.items.map(this.renderItem),
    };
    this.keyedItems = {};
    this.keyedElements = {};
    this.state.items.forEach((batchItem, index) => {
      if (batchItem.key) {
        this.keyedItems[batchItem.key] = this.props.items[index];
        this.keyedElements[batchItem.key] = batchItem;
      }
    });
  }

  componentWillReceiveProps(newProps) {
    if (this.props !== newProps) {
      const change = {items: {$splice: []}};
      const map = newProps.children;
      for (let i = 0; i < newProps.items.length; i++) {
        const itemKey = newProps.items[i].key;
        if (this.props.items[i] !== newProps.items[i]) {
          let element;
          if (
            itemKey in this.keyedItems &&
            this.keyedItems[itemKey] !== newProps.items[i]
          ) {
            element = this.renderItem(newProps.items[i], i, newProps.items, map);
            this.keyedItems[itemKey] = newProps.items[i];
            this.keyedElements[itemKey] = element;
          }
          else if (itemKey in this.keyedItems) {
            element = this.keyedElements[itemKey];
          }
          else {
            element = this.renderItem(newProps.items[i], i, newProps.items, map);
          }
          change.items.$splice.push(
            [i, 1, element]
          );
        }
      }
      if (this.props.items.length > newProps.items.length) {
        change.items.$splice.push([
          newProps.items.length,
          this.props.items.length - newProps.items.length,
        ]);
      }
      if (change.items.$splice.length > 0) {
        this.updateState(change);
      }
    }
  }

  shouldComponentUpdate(newProps, newState) {
    return (
      this.props !== newProps && this.props.items === newProps.items ||
      this.state.items !== newState.items
    );
  }

  renderItem(item, index, items, map = this.props.children) {
    const itemEl = map(item);
    return <BatchItem key={itemEl.key} item={item}>{itemEl}</BatchItem>;
  }

  render() {
    const children = this.state.items;
    const props = Object.assign({}, this.props);
    const Tag = props.tag || 'div';
    return (<Tag {...props}>{children}</Tag>);
  }
}

class BatchItem extends Component {
  shouldComponentUpdate(newProps) {
    return (this.props.item !== newProps.item);
  }

  render() {
    return Children.only(this.props.children);
  }
}
