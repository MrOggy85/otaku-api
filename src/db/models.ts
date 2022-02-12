import { DataTypes, Model, Relationships } from "../deps.ts";

export class Challenge extends Model {
  static table = "challenge";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  static tags() {
    return this.hasMany(Tag);
  }
}

export class Tag extends Model {
  static table = "tag";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  static challenges() {
    return this.hasMany(Challenge);
  }

  static sentences() {
    return this.hasMany(Sentence);
  }
}

export class Sentence extends Model {
  static table = "sentence";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  static tags() {
    return this.hasMany(Tag);
  }

  static ja() {
    return this.hasMany(Japanese);
  }
}

export class Japanese extends Model {
  static table = "japanese";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sentenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  };

  static sentence() {
    return this.hasOne(Sentence);
  }
}

export const TagChallenge = Relationships.manyToMany(Tag, Challenge);
export const TagSentence = Relationships.manyToMany(Tag, Sentence);

export class Guess extends Model {
  static table = "guess";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sentenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  };

  static sentence() {
    return this.hasOne(Sentence);
  }
}

export class User extends Model {
  static table = "user";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  static sentence() {
    return this.hasOne(Sentence);
  }
}
