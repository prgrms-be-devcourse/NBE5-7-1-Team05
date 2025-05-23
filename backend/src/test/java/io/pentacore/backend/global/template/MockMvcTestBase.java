package io.pentacore.backend.global.template;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.pentacore.backend.admin.dao.AdminRepository;
import io.pentacore.backend.global.config.MockTestConfig;
import io.pentacore.backend.product.dao.OrderProductRepository;
import io.pentacore.backend.product.dao.OrderRepository;
import io.pentacore.backend.product.dao.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@Import(MockTestConfig.class)
public abstract class MockMvcTestBase {
    @Autowired
    public ObjectMapper objectMapper;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public AdminRepository adminRepository;

    @Autowired
    public ProductRepository productRepository;

    @Autowired
    public OrderRepository orderRepository;

    @Autowired
    public OrderProductRepository orderProductRepository;

    public final Random random = new Random();

}
