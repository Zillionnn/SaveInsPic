import * as Toast from 'nativescript-toast';

export const toast = (val) => {
    Toast.makeText(val).show()
}
