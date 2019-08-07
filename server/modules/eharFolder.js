


exports.Folder = class Folder {
    //constructor(path, explored, childrens) {
    constructor(path, explored, childrens, parent) {
        this.path = path;
        this.explored = explored;
        this.childrens = childrens;
        this.exploredChildrens = 0;
        this.parent = parent; // actually useless but potentially useful to know your parents.
    }

    incrementNumFolders() {
        this.numFolders++;
    }

    concludeExploration(parent, children) {
        parent.addChildren(children);
    }

    addChildren(children) {
        this.exploredChildrens++;
        if (this.exploredChildrens == this.childrens) this.explored = true; // all my childs were explored       
    }
}


