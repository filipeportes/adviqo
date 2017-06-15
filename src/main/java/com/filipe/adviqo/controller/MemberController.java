package com.filipe.adviqo.controller;

import com.filipe.adviqo.model.Member;
import com.filipe.adviqo.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;

@Controller
public class MemberController {

    @Autowired
    private MemberRepository repository;

    @RequestMapping(value = "/member/new", method = RequestMethod.GET)
    public void newMember(HttpServletResponse resp) throws Exception {
        Member member = new Member("Filipe", "Portes", "2017/06/15", "74923-420");
        repository.save(member);
        System.out.println("new member created");
    }
}
