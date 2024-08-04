import inquirer from 'inquirer';
// Define the Account class
class Account {
    accountNumber;
    holderName;
    balance;
    constructor(accountNumber, holderName, initialBalance = 0) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = initialBalance;
    }
    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
        }
    }
    withdraw(amount) {
        if (amount > 0 && this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
    getBalance() {
        return this.balance;
    }
}
// Define the Bank class
class Bank {
    accounts = new Map();
    createAccount(holderName, initialBalance) {
        const accountNumber = (Math.floor(Math.random() * 1000000)).toString().padStart(6, '0');
        const account = new Account(accountNumber, holderName, initialBalance);
        this.accounts.set(accountNumber, account);
        return account;
    }
    getAccount(accountNumber) {
        return this.accounts.get(accountNumber);
    }
    listAccounts() {
        return Array.from(this.accounts.values());
    }
}
// Initialize the Bank instance
const bank = new Bank();
// Main menu function
const mainMenu = async () => {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['Create Account', 'Deposit', 'Withdraw', 'Check Balance', 'List Accounts', 'Exit'],
    });
    switch (action) {
        case 'Create Account':
            await createAccount();
            break;
        case 'Deposit':
            await deposit();
            break;
        case 'Withdraw':
            await withdraw();
            break;
        case 'Check Balance':
            await checkBalance();
            break;
        case 'List Accounts':
            listAccounts();
            break;
        case 'Exit':
            console.log('Goodbye!');
            return;
    }
    await mainMenu();
};
// Create account function
const createAccount = async () => {
    const { holderName, initialBalance } = await inquirer.prompt([
        {
            type: 'input',
            name: 'holderName',
            message: 'Enter account holder name:',
        },
        {
            type: 'input',
            name: 'initialBalance',
            message: 'Enter initial balance:',
            validate: (input) => {
                const balance = parseFloat(input);
                return !isNaN(balance) && balance >= 0 ? true : 'Please enter a valid amount.';
            },
        },
    ]);
    const account = bank.createAccount(holderName, parseFloat(initialBalance));
    console.log(`Account created: Number: ${account.accountNumber}, Holder: ${account.holderName}, Balance: ${account.getBalance()}`);
};
// Deposit function
const deposit = async () => {
    const { accountNumber, amount } = await inquirer.prompt([
        {
            type: 'input',
            name: 'accountNumber',
            message: 'Enter account number:',
        },
        {
            type: 'input',
            name: 'amount',
            message: 'Enter amount to deposit:',
            validate: (input) => {
                const amount = parseFloat(input);
                return !isNaN(amount) && amount > 0 ? true : 'Please enter a valid amount.';
            },
        },
    ]);
    const account = bank.getAccount(accountNumber);
    if (account) {
        account.deposit(parseFloat(amount));
        console.log(`Deposited ${amount} to account ${accountNumber}. New balance: ${account.getBalance()}`);
    }
    else {
        console.log('Account not found.');
    }
};
// Withdraw function
const withdraw = async () => {
    const { accountNumber, amount } = await inquirer.prompt([
        {
            type: 'input',
            name: 'accountNumber',
            message: 'Enter account number:',
        },
        {
            type: 'input',
            name: 'amount',
            message: 'Enter amount to withdraw:',
            validate: (input) => {
                const amount = parseFloat(input);
                return !isNaN(amount) && amount > 0 ? true : 'Please enter a valid amount.';
            },
        },
    ]);
    const account = bank.getAccount(accountNumber);
    if (account) {
        const success = account.withdraw(parseFloat(amount));
        if (success) {
            console.log(`Withdrew ${amount} from account ${accountNumber}. New balance: ${account.getBalance()}`);
        }
        else {
            console.log('Insufficient funds or invalid amount.');
        }
    }
    else {
        console.log('Account not found.');
    }
};
// Check balance function
const checkBalance = async () => {
    const { accountNumber } = await inquirer.prompt([
        {
            type: 'input',
            name: 'accountNumber',
            message: 'Enter account number:',
        },
    ]);
    const account = bank.getAccount(accountNumber);
    if (account) {
        console.log(`Account ${accountNumber} balance: ${account.getBalance()}`);
    }
    else {
        console.log('Account not found.');
    }
};
// List accounts function
const listAccounts = () => {
    const accounts = bank.listAccounts();
    if (accounts.length === 0) {
        console.log('No accounts found.');
    }
    else {
        accounts.forEach(account => {
            console.log(`Number: ${account.accountNumber}, Holder: ${account.holderName}, Balance: ${account.getBalance()}`);
        });
    }
};
// Start the application
mainMenu();
