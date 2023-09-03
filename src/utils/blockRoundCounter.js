class BlockRoundCounter {
    index = 0;
    amount = 0;
    joined = false;

    PADDING_TOP = ' pt-5';
    UNROUNDED_TOP = ' rounded-t-0'
    UNROUNDED_BOTTOM = ' rounded-b-0'
    PADDING_BOTTOM = ' pb-5'
    PADDING_X = ' px-15';

    constructor(index, amount, joined) {
        this.index = index;
        this.amount = amount;
        this.joined = joined
    }

    roundIt() {
        let textClass = '';
            textClass += this.PADDING_BOTTOM;
        if( this.joined && window.innerWidth > 1280 )
            textClass += this.PADDING_X;
        if( this.index === 0 && this.joined )
            textClass += this.PADDING_TOP;
        if( this.index === 0 && this.amount > 1)
            textClass += this.UNROUNDED_BOTTOM;
        if( this.index === this.amount - 1 && this.amount > 1 )
            textClass += this.UNROUNDED_TOP;
        if( this.index !== 0 && this.index !== this.amount - 1 )
            textClass += this.UNROUNDED_BOTTOM + this.UNROUNDED_TOP;
        return textClass
    }
}

function rounder(index, amount, joined) {
    return (new BlockRoundCounter(index, amount, joined)).roundIt();
}

export {rounder}
