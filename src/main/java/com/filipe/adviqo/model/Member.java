package com.filipe.adviqo.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Getter
@Entity
@NoArgsConstructor
@EqualsAndHashCode(of = {"firstName", "lastName", "birthDate"})
public class Member {

    @Id
    @GeneratedValue
    private Long id;
    private String firstName;
    private String lastName;
    //TODO solve json conversion
    private String birthdate;
    private String postalCode;

    public Member(String firstName, String lastName, String birthdate, String postalCode) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthdate = birthdate;
        this.postalCode = postalCode;
    }
}
